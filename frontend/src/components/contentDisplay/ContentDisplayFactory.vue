<!-- Visualizes a content object. -->
<template>
  <div class="h-full p-3 relative">
    <div class="h-full" :class="{ 'border-1': editMode }">
      <div class="h-full" v-if="content">
        <EmbedDisplay
          v-if="content.contentType === ContentType.EMBED"
          :embed-content="(content as EmbedContent)"
          :edit-mode="editMode"
          class="h-full"
          @editing="(val) => $emit('editing', val)"
        />
        <TextDisplay
          v-else-if="content.contentType === ContentType.TEXT"
          :text-content="(content as TextContent)"
          :edit-mode="editMode"
          :layout-slot="layoutSlot"
          class="h-full"
          @editing="(val) => $emit('editing', val)"
        />
        <ImageDisplay
          v-else-if="content.contentType === ContentType.IMAGE"
          :image-content="(content as ImageContent)"
          :edit-mode="editMode"
          class="h-full"
          @editing="(val) => $emit('editing', val)"
        />
        <H5PDisplay
          v-else-if="content.contentType === ContentType.H5P"
          :h5p-content="(content as H5PContent)"
          :edit-mode="editMode"
          class="h-full"
          @editing="(val) => $emit('editing', val)"
        />
      </div>
      <div
        class="absolute flex flex-rows space-x-2 top-3 right-3"
        v-if="editMode && layoutSlot != LayoutSlot.HEADER"
      >
        <img
          v-for="[content, image] in possibleNewContentTypes"
          :key="content"
          class="h-3 cursor-pointer"
          :src="getIconUrl(image)"
          @click="$emit('changeContent', content)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { Content, ContentType } from '../../../../model/slide/content/Content';
import EmbedDisplay from './EmbedDisplay.vue';
import { EmbedContent } from '../../../../model/slide/content/EmbedContent';
import { ImageContent } from '../../../../model/slide/content/ImageContent';
import ImageDisplay from './ImageDisplay.vue';
import TextDisplay from './TextDisplay.vue';
import { TextContent } from '../../../../model/slide/content/TextContent';
import H5PDisplay from './H5PDisplay.vue';
import { H5PContent } from '../../../../model/slide/content/H5PContent';
import { LayoutSlot } from '../../../../model/slide/layout/Layout';

const props = defineProps({
  /**
   * The content to display
   */
  content: {
    type: Object as PropType<Content>,
    required: false,
  },

  /**
   * Indicates whether student or teacher is viewing the slide
   */
  editMode: {
    type: Boolean,
    required: false,
    default: false,
  },
  /**
   * The slot this display is in
   */
  layoutSlot: {
    type: Number as PropType<LayoutSlot>,
    required: true,
  },
});

defineEmits([
  /**
   * Emitted when the content is being edited
   *
   * @param val Information given from the display
   */
  'editing',
  /**
   * Emitted when the content is being changed
   *
   * @param content The new content
   */
  'changeContent',
]);

/**
 * Returns the url of the icon-asset with the supplied name.
 * @param image icon image to return
 * @returns url to the icon
 */
function getIconUrl(image: string): string {
  return new URL(`../../assets/icons/${image}`, import.meta.url).href;
}

const possibleNewContentTypes = computed(() => {
  const contentTypes = [
    ContentType.TEXT,
    ContentType.IMAGE,
    ContentType.H5P,
    ContentType.EMBED,
  ];
  if (props.content) {
    contentTypes.splice(contentTypes.indexOf(props.content.contentType), 1);
  }

  const imageUrls: Record<ContentType, string> = {
    [ContentType.TEXT]: 'text.png',
    [ContentType.IMAGE]: 'image.png',
    [ContentType.H5P]: 'h5p.png',
    [ContentType.EMBED]: 'embed.png',
  };

  const returnValue: [ContentType, string][] = [];
  for (const c of contentTypes) {
    returnValue.push([c, imageUrls[c]]);
  }

  return returnValue;
});
</script>
