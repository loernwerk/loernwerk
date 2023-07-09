<!-- View for editing seqeunces -->
<template>
  <div class="flex flex-row grow space-x-5">
    <SlideOverviewContainer
      :slides="sequence.slides"
      @selection-changed="(val) => (selectedSlideIndex = val)"
    />
    <div class="flex flex-col grow space-y-5">
      <TabbedContainer class="h-48" :tabs="tabs">
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
            :embedContent="emb"
            @update-content="(val) => (emb = val)"
          />
        </template>

        <template #Bild>
          <ImageOptionsTab
            :imageContent="im"
            @update-content="(val) => (im = val)"
          />
        </template>

        <template #Text>
          <TextOptionsTab :textContent="txt" />
        </template>
      </TabbedContainer>
      <div class="grow flex items-center justify-center">
        <SlideDisplayFactory
          :slide="selectedSlide"
          :edit-mode="true"
          class="h-[100%]"
          @editing="(val) => selectEditingSlot(val.slot)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, ref } from 'vue';
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

defineProps({
  /**
   * The code of the sequence to edit
   */
  sequenceCode: {
    type: String,
    required: true,
  },
});

const emb = ref({
  type: ContentType.EMBED,
  url: 'youtube.com/embed/',
});

const im = ref({
  type: ContentType.IMAGE,
  img: ' data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABgUExURf////3MyPYrJfUqJH4/FH0+E/zDdgAAAPvDdvvDevzCen8+FEVUyURTyfmxr/lhYHOC13KA2HKB1vcxKv7dUP7dT/cwKkRVy0RVyURTyEVUykRTxkNSx5ZOHpROHebUxiDKqjUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIcSURBVGhD7dftThtBDIXhQIECJbSlpRBa4P7vEnz8KrbYSdiZSSo+5vmxGox9vCutQlgMw2YH29DT7XAberoRV0ZPN+LK6OlGXBk93Ygro6eHcr7oWpZ/x0w1DY8lc2n4Qyw5Mse6uhPzVXQ8obGHgseSuRS8vyXHopx0dHlJwmSFdOPp6NKSU10dkxVScjq6sWQiJaej298Sp4KbFOSM+VlShB+dCm5SkHPmZ0kRfnQquElB/suTvOkl6bMrf7h4hR/WGpYI4+Ebv3iWPzyZrMCgITqMJRMMGqLDzpYkRJfR0424Mnq6EVdGTzfiyujpRlwZPd2IK6OnB1+lzYVZ6rjUWUf/wk13I0U4BY8lWynCKXjHSy7le/hhfup4pbOOzpuZrKA7zHT3G57EMVmBwaDgsWQDBoOCd7bkFzMv/DbXir/WWdW8RP6Q8oqxxH26Jef8zTOau1Gy+MvrV7lVB91m5j9BZ7QbRVQtmfmtfixxDUuEPLNKV7mjZ611yR2BzyZP0rokv8JStaThFZZ9PMnHXELU2mTJX13pNp9uSX6FFZG8vqThFVZEsrMnyUv+mZWubmU4Gz/TbWYuyXSfyVLVyZOo2kwRyViylSKSvSy5D1SCqg+6UmmkCEclqDqWZIpwVIKq72CJhjPqgXqgXoHBQD1QD9QrMBioB+qBegUGA/VAPVCvwGCgHqgH6hUeX6IeqAfqw1u3WDwBMxSLRhknKX0AAAAASUVORK5CYII=',
  scale: 0.5,
});

const h = ref({
  type: ContentType.H5P,
  h5pContentId: '',
  sequenceCode: '',
});

const txt: Ref<TextContent> = ref({
  type: ContentType.TEXT,
  textSnippets: [],
  alignmentHorizontal: 'center',
  alignmentVertical: 'center',
});

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

sequence.value.slides.push({
  layout: LayoutType.SINGLE_COLUMN,
  content: {
    [LayoutSlot.MAIN]: emb.value,
  },
  backgroundColor: '#ff0000',
  sequenceCode: '',
  order: 0,
  id: 0,
});

sequence.value.slides.push({
  layout: LayoutType.SINGLE_COLUMN,
  content: {
    [LayoutSlot.MAIN]: im.value,
  },
  backgroundColor: '#00ff00',
  sequenceCode: '',
  order: 1,
  id: 1,
});

sequence.value.slides.push({
  layout: LayoutType.SINGLE_COLUMN,
  content: {
    [LayoutSlot.MAIN]: h.value,
  },
  backgroundColor: '#0000ff',
  sequenceCode: '',
  order: 2,
  id: 2,
});

sequence.value.slideCount = sequence.value.slides.length;

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
  if (type && type != ContentType.H5P) {
    return tabNameMap[type];
  }
  return undefined;
}

/**
 * Selects the tab for the given slot
 * @param slot Slot to select for
 */
function selectEditingSlot(slot: LayoutSlot): void {
  currentEditingSlot.value = slot;
  const tabName = getTabNameForSlot(slot);
  if (tabName) {
    editOptionsTabContainer.value?.selectTab(tabName);
  }
}

const tabs = computed(() => {
  const tabs = ['Seite'];
  const slot = currentEditingSlot.value;
  if (slot) {
    const tabName = getTabNameForSlot(slot);
    if (tabName) {
      tabs.push(tabName);
    }
  }
  return tabs;
});

/**
 * Saves the sequence
 */
async function save(): Promise<void> {
  await SequenceRestInterface.updateSequence(sequence.value);
}
</script>
