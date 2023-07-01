<!-- Visualizes a content object. -->
<template>
  <div class="h-full p-3">
    <div v-if="content.type === ContentType.EMBED" class="h-full">
      <EmbedEditDisplay
        v-if="editMode"
        :embed-content="(content as EmbedContent)"
      />
      <EmbedDisplay v-else :embed-content="(content as EmbedContent)" />
    </div>

    <div v-if="content.type === ContentType.TEXT" class="h-full">
      <TextDisplay :text-content="(content as TextContent)" />
    </div>

    <div v-if="content.type === ContentType.IMAGE" class="h-full">
      <ImageEditDisplay
        v-if="editMode"
        :image-content="(content as ImageContent)"
      />
      <ImageDisplay v-else :image-content="(content as ImageContent)" />
    </div>

    <div v-if="content.type === ContentType.H5P" class="h-full"></div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { Content, ContentType } from '../../../../model/slide/content/Content';
import EmbedDisplay from './EmbedDisplay.vue';
import { EmbedContent } from '../../../../model/slide/content/EmbedContent';
import { ImageContent } from '../../../../model/slide/content/ImageContent';
import ImageDisplay from './ImageDisplay.vue';
import EmbedEditDisplay from './EmbedEditDisplay.vue';
import ImageEditDisplay from './ImageEditDisplay.vue';
import TextDisplay from './TextDisplay.vue';
import { TextContent } from '../../../../model/slide/content/TextContent';

defineProps({
  /**
   * The content to display
   */
  content: {
    type: Object as PropType<Content>,
    required: true,
  },

  /**
   * Indicates whether student or teacher is viewing the slide
   */
  editMode: {
    type: Boolean,
    required: true,
    default: false,
  },
});
</script>
