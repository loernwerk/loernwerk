<!-- View for editing seqeunces -->
<template>
  <div class="flex flex-row grow space-x-5">
    <SlideOverviewContainer
      :slides="sequence.slides"
      @selection-changed="(val) => changeSelectedSlide(val)"
      @add-slide="addSlide()"
      @delete-slide="(val) => deleteSlide(val)"
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
          <TextOptionsTab />
        </template>
      </TabbedContainer>
      <div class="grow flex items-center justify-center">
        <SlideDisplayFactory
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
import { LayoutSlot, LayoutType } from '../../../model/slide/layout/Layout';
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

defineProps({
  /**
   * The code of the sequence to edit
   */
  sequenceCode: {
    type: String,
    required: true,
  },
});

// TODO: replace with database request
const sequence = ref<ISequenceWithSlides>({
  code: '',
  name: '',
  slides: [],
  creationDate: new Date(),
  modificationDate: new Date(),
  writeAccess: [],
  readAccess: [],
  authorId: 0,
  slideCount: 0,
});

if (sequence.value.slides.length == 0) {
  addSlide();
}

const selectedSlideIndex = ref(0);
const selectedSlide = computed(
  () => sequence.value.slides[selectedSlideIndex.value]
);

const editOptionsTabContainer: Ref<typeof TabbedContainer | null> = ref(null);

const currentEditingSlot: Ref<LayoutSlot | null> = ref(null);

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

const tabs = ref(['Seite']);

/**
 * Selects the tab for the given slot
 * @param slot Slot to select for
 */
function selectEditingSlot(slot: LayoutSlot): void {
  currentEditingSlot.value = slot;
}

/**
 * Updates the content in the given slot
 * @param slot Slot of content
 * @param update Object containing data for update
 */
function updateContent(slot: LayoutSlot, update: unknown): void {
  if (selectedSlide.value.content[slot]?.type == ContentType.TEXT) {
    (selectedSlide.value.content[slot] as TextContent).delta = update as Delta;
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
 * Adds a new slide to the sequence
 */
function addSlide(): void {
  let maxId = -1;
  sequence.value.slides.forEach((slide) => {
    if (slide.id > maxId) {
      maxId = slide.id;
    }
  });

  sequence.value.slides.push({
    layout: LayoutType.SINGLE_COLUMN,
    content: {},
    backgroundColor: '#ffffff',
    sequenceCode: sequence.value.code,
    order: sequence.value.slides.length,
    id: maxId + 1,
  });
  sequence.value.slideCount = sequence.value.slides.length;
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
 * Saves the sequence
 */
async function save(): Promise<void> {
  await SequenceRestInterface.updateSequence(sequence.value);
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
      content.h5pContentId = '';
      break;
  }

  sequence.value.slides[selectedSlideIndex.value].content[slot] = content;
  updateShownTabs();
}
</script>
