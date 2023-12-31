<!-- View for editing seqeunces -->
<template>
  <div class="flex flex-row grow space-x-5">
    <div class="flex flex-col space-y-5">
      <ButtonComponent @click="save()" :loading="disableButton"
        ><div class="py-1 text-xl text-center">
          {{ $t('save') }}
        </div></ButtonComponent
      >
      <SlideOverviewContainer
        :slides="sequence.slides"
        :selected-slide-index="selectedSlideIndex"
        @selection-changed="(val) => changeSelectedSlide(val)"
        @add-slide="addSlide()"
        @delete-slide="(val) => deleteSlide(val)"
        @order-changed="updateSlideOrder()"
        class="flex-grow"
      />
    </div>

    <div class="flex flex-col grow space-y-5">
      <TabbedContainer
        class="h-36 flex-shrink-0"
        :shown-tabs="tabs"
        :possible-tabs="allTabs"
        ref="editOptionsTabContainer"
      >
        <template v-slot:[getTab(0)]>
          <SlideOptionsTab
            :slide="selectedSlide"
            :sequence="sequence"
            :disable-button="disableButton"
            @update-sequence="
              (val) => {
                sequence.name = val.name;
                edited = true;
              }
            "
            @update-slide="(val) => updateSlide(val)"
          />
        </template>

        <template v-slot:[getTab(1)]>
          <LayoutOptionsTab
            :slide="selectedSlide"
            @update-slide="(val: ISlide) => updateSlide(val)"
          />
        </template>

        <template v-slot:[getTab(4)]>
          <EmbedOptionsTab
            v-if="currentEditingSlot"
            :embedContent="(selectedSlide.content[currentEditingSlot] as EmbedContent)"
            @update-content="
              (val) => {
                selectedSlide.content[currentEditingSlot as LayoutSlot] = val;
                edited = true;
              }"
          />
        </template>

        <template v-slot:[getTab(3)]>
          <ImageOptionsTab
            v-if="currentEditingSlot"
            :imageContent="(selectedSlide.content[currentEditingSlot] as ImageContent)"
            @update-content="
              (val) => {
                selectedSlide.content[currentEditingSlot as LayoutSlot] = val;
                edited = true;
              }"
          />
        </template>

        <template v-slot:[getTab(2)]>
          <TextOptionsTab
            :key="forceRefresh"
            :selected-slot="
              currentEditingSlot != null ? currentEditingSlot : undefined
            "
          />
        </template>
      </TabbedContainer>
      <div class="grow flex items-center justify-center relative">
        <SlideDisplayFactory
          :key="forceRefresh"
          :slide="selectedSlide"
          :edit-mode="true"
          :editing="currentEditingSlot ?? undefined"
          class="h-full absolute"
          @editing="
            (val) => {
              selectEditingSlot(val.slot);
              updateContent(val.slot, val.emit);
            }
          "
          @change-content="(val) => changeContent(val.slot, val.type)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { ISequenceWithSlides } from '../../../model/sequence/ISequenceWithSlides';
import SlideOverviewContainer from '../components/SlideOverviewContainer.vue';
import {
  Layout,
  LayoutSlot,
  LayoutType,
} from '../../../model/slide/layout/Layout';
import TabbedContainer from '../components/TabbedContainer.vue';
import { ContentType } from '../../../model/slide/content/Content';
import EmbedOptionsTab from '../components/sequenceEditOptionsTab/EmbedOptionsTab.vue';
import ImageOptionsTab from '../components/sequenceEditOptionsTab/ImageOptionsTab.vue';
import SlideOptionsTab from '../components/sequenceEditOptionsTab/SlideOptionsTab.vue';
import TextOptionsTab from '../components/sequenceEditOptionsTab/TextOptionsTab.vue';
import SlideDisplayFactory from '../components/contentDisplay/SlideDisplayFactory.vue';
import LayoutOptionsTab from '../components/sequenceEditOptionsTab/LayoutOptionsTab.vue';
import { SequenceRestInterface } from '../restInterfaces/SequenceRestInterface';
import { TextContent } from '../../../model/slide/content/TextContent';
import { ImageContent } from '../../../model/slide/content/ImageContent';
import { EmbedContent } from '../../../model/slide/content/EmbedContent';
import { H5PContent } from '../../../model/slide/content/H5PContent';
import Delta from 'quill-delta';
import { ISlide } from '../../../model/slide/ISlide';
import { useRouter } from 'vue-router';
import { i18n } from '../i18n';
import ButtonComponent from '../components/ButtonComponent.vue';

const props = defineProps({
  /**
   * The code of the sequence to edit
   */
  sequenceCode: {
    type: String,
    required: true,
  },
});

const disableButton = ref(false);
const edited = ref(false);
const forceRefresh = ref(0);

onMounted(() => {
  window.addEventListener('beforeunload', onUnloadEventListener);
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', onUnloadEventListener);
});
onMounted(() => {
  window.addEventListener('beforeunload', onUnloadEventListener);
});

useRouter().beforeEach((to, from) => {
  void to;
  if (from.name === 'SequenceEdit' && edited.value) {
    const result = confirm(i18n.global.t('leaveWarning'));
    if (result) {
      edited.value = false;
    } else {
      return false;
    }
  }
});

/**
 * an event listener for the beforunloadevent which prevents leaving with unsaved content
 * @param event the unloadevent
 * @returns the message to be prompted
 */
function onUnloadEventListener(event: BeforeUnloadEvent): string | undefined {
  if (edited.value) {
    event.preventDefault();
    event.returnValue = i18n.global.t('leaveWarning'); // chromium fix
    return i18n.global.t('leaveWarning');
  }
}

const sequence = ref<ISequenceWithSlides>(
  await SequenceRestInterface.getSequence(props.sequenceCode)
);
sequence.value.slides.sort((slideA, slideB) => {
  return slideA.order - slideB.order;
});

if (sequence.value.slides.length == 0) {
  addSlide();
  // addSlide triggers the edited to be true, but we kinda don't want this here, since this is not a "real", user intented-change
  edited.value = false;
}

const selectedSlideIndex = ref(0);
const selectedSlide = computed(
  () => sequence.value.slides[selectedSlideIndex.value]
);
const router = useRouter();

/**
 * Updates the content in the given slot
 * @param slot Slot of content
 * @param update Object containing data for update
 */
function updateContent(slot: LayoutSlot, update: unknown): void {
  edited.value = true;
  if (selectedSlide.value.content[slot]?.contentType == ContentType.TEXT) {
    (selectedSlide.value.content[slot] as TextContent).delta = update as Delta;
  }
  if (
    selectedSlide.value.content[slot]?.contentType == ContentType.H5P &&
    update !== null
  ) {
    forceRefresh.value++;
    if (update !== undefined) {
      (selectedSlide.value.content[slot] as H5PContent).h5pContentId =
        update as string;
    }
  }
}

/**
 * Changes the content of the given slot to the given content type
 * @param slot Slot to change the content for
 * @param contentType Content type to change to
 */
function changeContent(slot: LayoutSlot, contentType: ContentType): void {
  edited.value = true;
  if (selectedSlide.value.content[slot]) {
    const result = confirm(i18n.global.t('looseContentWarning'));
    if (!result) {
      return;
    }
  }

  let content;
  switch (contentType) {
    case ContentType.IMAGE:
      content = new ImageContent();
      content.contentType = ContentType.IMAGE;
      content.img = '';
      content.scale = 1;
      break;

    case ContentType.TEXT:
      content = new TextContent();
      content.contentType = ContentType.TEXT;
      content.delta = new Delta();
      break;

    case ContentType.EMBED:
      content = new EmbedContent();
      content.contentType = ContentType.EMBED;
      content.url = '';
      break;

    case ContentType.H5P:
      content = new H5PContent();
      content.contentType = ContentType.H5P;
      content.h5pContentId = 'new';
      break;
  }

  sequence.value.slides[selectedSlideIndex.value].content[slot] = content;
  updateShownTabs();
}

/**
 * Switches to the slide with the given index
 * @param index Index of the slide to select
 */
function changeSelectedSlide(index: number): void {
  selectedSlideIndex.value = index;
  forceRefresh.value++;
  currentEditingSlot.value = null;
  editOptionsTabContainer.value?.selectTab('Seite');
}

/**
 * Adds a new slide to the sequence
 */
function addSlide(): void {
  edited.value = true;
  let maxId = -1;
  sequence.value.slides.forEach((slide) => {
    if (slide.id > maxId) {
      maxId = slide.id;
    }
  });

  const slide: ISlide = {
    layout: LayoutType.SINGLE_COLUMN_WITH_HEADER,
    content: {},
    backgroundColor: '#ffffff',
    sequenceCode: sequence.value.code,
    order: sequence.value.slides.length,
    id: maxId + 1,
  };
  const header = new TextContent();
  header.contentType = ContentType.TEXT;
  header.delta = new Delta();
  slide.content[LayoutSlot.HEADER] = header;

  sequence.value.slides.push(slide);
  sequence.value.slideCount = sequence.value.slides.length;
}

/**
 * Updates the order of the slides after a drag and drop event
 */
function updateSlideOrder(): void {
  edited.value = true;
  for (let i = 0; i < sequence.value.slides.length; i++) {
    // eslint-disable-next-line vue/no-mutating-props
    sequence.value.slides[i].order = i;
  }
}

/**
 * Deletes the slide at the given index
 * @param index Index of the slide to delete
 */
function deleteSlide(index: number): void {
  edited.value = true;
  if (sequence.value.slides.length == 1) {
    return;
  }
  if (selectedSlideIndex.value >= index) {
    selectedSlideIndex.value -= 1;
  }
  sequence.value.slides.splice(index, 1);
  sequence.value.slideCount--;
}

/**
 * Updates the selected slide
 * @param slide Slide to use for update
 */
function updateSlide(slide: ISlide): void {
  edited.value = true;
  if (Layout.hasHeader(slide.layout) && !slide.content[LayoutSlot.HEADER]) {
    const header = new TextContent();
    header.contentType = ContentType.TEXT;
    header.delta = new Delta();
    slide.content[LayoutSlot.HEADER] = header;
  }
  sequence.value.slides[selectedSlideIndex.value] = slide;
}

const currentEditingSlot: Ref<LayoutSlot | null> = ref(null);
const tabs = ref(['slide', 'content.layout']);
const allTabs = ref([
  'slide',
  'content.layout',
  'content.text',
  'content.image',
  'content.embed',
]);
const editOptionsTabContainer: Ref<typeof TabbedContainer | null> = ref(null);

/**
 * Selects the tab for the given slot
 * @param slot Slot to select for
 */
function selectEditingSlot(slot: LayoutSlot): void {
  currentEditingSlot.value = slot;
}

/**
 * Updates the tabs shown in the tab container
 */
function updateShownTabs(): void {
  const slot = currentEditingSlot.value;
  tabs.value = ['slide', 'content.layout'];
  if (slot != null) {
    const tabName = getTabNameForSlot(slot);
    if (tabName) {
      tabs.value.push(tabName);
      editOptionsTabContainer.value?.selectTab(tabName);
    }
  }
}
watch(currentEditingSlot, () => {
  updateShownTabs();
});

/**
 * Returns the name of the tab for the given slot
 * @param slot Slot to get the name for
 * @returns Name of the tab for the given slot or null if the slot does not have a coreesponding tab
 */
function getTabNameForSlot(slot: LayoutSlot): string | undefined {
  const tabNameMap = {
    [ContentType.TEXT]: 'content.text',
    [ContentType.IMAGE]: 'content.image',
    [ContentType.EMBED]: 'content.embed',
  };
  const type = selectedSlide.value.content[slot]?.contentType;
  if (type != undefined && type != ContentType.H5P) {
    return tabNameMap[type];
  }
  return undefined;
}

/**
 * Gets the tab name for the given content type
 * @param index index in the tab array
 * @returns The tab for the given content type
 */
function getTab(index: number): string {
  return allTabs.value[index];
}

/**
 * Saves the sequence
 */
async function save(): Promise<void> {
  disableButton.value = true;
  try {
    await SequenceRestInterface.updateSequence(sequence.value);
    edited.value = false;
    await router.push({ name: 'Overview' });
  } catch (e) {
    disableButton.value = false;
    throw e;
  }
}
</script>
