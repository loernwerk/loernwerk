<!-- View for editing seqeunces -->
<template>
  <div class="flex flex-row grow space-x-5">
    <SlideOverviewContainer
      :slides="sequence.slides"
      :selected-slide-index="selectedSlideIndex"
      @selection-changed="(val) => changeSelectedSlide(val)"
      @add-slide="addSlide()"
      @delete-slide="(val) => deleteSlide(val)"
      @order-changed="updateSlideOrder()"
    />
    <div class="flex flex-col grow space-y-5">
      <TabbedContainer
        class="h-48"
        :shown-tabs="tabs"
        :possible-tabs="['Seite', 'Embed', 'Bild', 'Text']"
        ref="editOptionsTabContainer"
      >
        <template #Seite>
          <SlideOptionsTab
            :slide="selectedSlide"
            :sequence="sequence"
            @update-sequence="(val) => (sequence.name = val.name)"
            @update-slide="(val) => updateSlide(val)"
            @save="save()"
          />
        </template>

        <template #Embed>
          <EmbedOptionsTab
            v-if="currentEditingSlot"
            :embedContent="(selectedSlide.content[currentEditingSlot] as EmbedContent)"
            @update-content="(val) => (selectedSlide.content[currentEditingSlot as LayoutSlot] = val)"
          />
        </template>

        <template #Bild>
          <ImageOptionsTab
            v-if="currentEditingSlot"
            :imageContent="(selectedSlide.content[currentEditingSlot] as ImageContent)"
            @update-content="(val) => (selectedSlide.content[currentEditingSlot as LayoutSlot] = val)"
          />
        </template>

        <template #Text>
          <TextOptionsTab
            :key="selectedSlideIndex"
            :selected-slot="
              currentEditingSlot != null ? currentEditingSlot : undefined
            "
          />
        </template>
      </TabbedContainer>
      <div class="grow flex items-center justify-center">
        <SlideDisplayFactory
          :key="selectedSlideIndex"
          :slide="selectedSlide"
          :edit-mode="true"
          class="h-[100%]"
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
import { Ref, computed, ref, watch } from 'vue';
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
import { SequenceRestInterface } from '../restInterfaces/SequenceRestInterface';
import { TextContent } from '../../../model/slide/content/TextContent';
import { ImageContent } from '../../../model/slide/content/ImageContent';
import { EmbedContent } from '../../../model/slide/content/EmbedContent';
import { H5PContent } from '../../../model/slide/content/H5PContent';
import Delta from 'quill-delta';
import { ISlide } from '../../../model/slide/ISlide';

const props = defineProps({
  /**
   * The code of the sequence to edit
   */
  sequenceCode: {
    type: String,
    required: true,
  },
});

const sequence = ref<ISequenceWithSlides>(
  await SequenceRestInterface.getSequence(props.sequenceCode)
);

if (sequence.value.slides.length == 0) {
  addSlide();
}

const selectedSlideIndex = ref(0);
const selectedSlide = computed(
  () => sequence.value.slides[selectedSlideIndex.value]
);

/**
 * Updates the content in the given slot
 * @param slot Slot of content
 * @param update Object containing data for update
 */
function updateContent(slot: LayoutSlot, update: unknown): void {
  if (selectedSlide.value.content[slot]?.type == ContentType.TEXT) {
    (selectedSlide.value.content[slot] as TextContent).delta = update as Delta;
  }
  if (selectedSlide.value.content[slot]?.type == ContentType.H5P) {
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
  let content;
  switch (contentType) {
    case ContentType.IMAGE:
      content = new ImageContent();
      content.type = ContentType.IMAGE;
      content.img = '';
      content.scale = 1;
      break;

    case ContentType.TEXT:
      content = new TextContent();
      content.type = ContentType.TEXT;
      content.delta = new Delta();
      break;

    case ContentType.EMBED:
      content = new EmbedContent();
      content.type = ContentType.EMBED;
      content.url = '';
      break;

    case ContentType.H5P:
      content = new H5PContent();
      content.type = ContentType.H5P;
      content.h5pContentId = 'new';
      content.sequenceCode = props.sequenceCode;
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
  currentEditingSlot.value = null;
  editOptionsTabContainer.value?.selectTab('Seite');
}

/**
 * Adds a new slide to the sequence
 */
function addSlide(): void {
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
  header.type = ContentType.TEXT;
  header.delta = new Delta();
  slide.content[LayoutSlot.HEADER] = header;

  sequence.value.slides.push(slide);
  sequence.value.slideCount = sequence.value.slides.length;
}

/**
 * Updates the order of the slides after a drag and drop event
 */
function updateSlideOrder(): void {
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
  if (sequence.value.slides.length == 1) {
    return;
  }
  sequence.value.slides.splice(index, 1);
  sequence.value.slideCount--;
}

/**
 * Updates the selected slide
 * @param slide Slide to use for update
 */
function updateSlide(slide: ISlide): void {
  if (Layout.hasHeader(slide.layout) && !slide.content[LayoutSlot.HEADER]) {
    const header = new TextContent();
    header.type = ContentType.TEXT;
    header.delta = new Delta();
    slide.content[LayoutSlot.HEADER] = header;
  }
  sequence.value.slides[selectedSlideIndex.value] = slide;
}

const currentEditingSlot: Ref<LayoutSlot | null> = ref(null);
const tabs = ref(['Seite']);
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
  tabs.value = ['Seite'];
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
    [ContentType.TEXT]: 'Text',
    [ContentType.IMAGE]: 'Bild',
    [ContentType.EMBED]: 'Embed',
  };
  const type = selectedSlide.value.content[slot]?.type;
  if (type != undefined && type != ContentType.H5P) {
    return tabNameMap[type];
  }
  return undefined;
}

/**
 * Saves the sequence
 */
async function save(): Promise<void> {
  await SequenceRestInterface.updateSequence(sequence.value);
}
</script>