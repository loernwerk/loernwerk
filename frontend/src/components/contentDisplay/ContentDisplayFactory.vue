<!-- Visualizes a content object. -->
<template>
  <div class="h-full p-3">
    <EmbedDisplay
      v-if="content.type === ContentType.EMBED"
      :embed-content="(content as EmbedContent)"
      :edit-mode="editMode"
      class="h-full"
    />
    <TextDisplay
      v-else-if="content.type === ContentType.TEXT"
      :text-content="(content as TextContent)"
      :edit-mode="editMode"
      class="h-full"
    />
    <ImageDisplay
      v-else-if="content.type === ContentType.IMAGE"
      :image-content="(content as ImageContent)"
      :edit-mode="editMode"
      class="h-full"
    />
    <H5PDisplay
      v-else-if="content.type === ContentType.H5P"
      :h5p-content="(content as H5PContent)"
      :edit-mode="editMode"
      class="h-full"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { Content, ContentType } from '../../../../model/slide/content/Content';
import EmbedDisplay from './EmbedDisplay.vue';
import { EmbedContent } from '../../../../model/slide/content/EmbedContent';
import { ImageContent } from '../../../../model/slide/content/ImageContent';
import ImageDisplay from './ImageDisplay.vue';
import TextDisplay from './TextDisplay.vue';
import { TextContent } from '../../../../model/slide/content/TextContent';
import H5PDisplay from './H5PDisplay.vue';
import { H5PContent } from '../../../../model/slide/content/H5PContent';

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
