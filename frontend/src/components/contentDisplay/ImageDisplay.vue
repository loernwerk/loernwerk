<!-- Displays an image content. -->
<template>
  <div
    class="flex justify-center items-center h-full w-full overflow-hidden"
    @click="$emit('editing')"
  >
    <img
      :src="imageContent.img"
      class="w-auto h-auto block"
      :style="{
        maxHeight: `${imageContent.scale * 100}%`,
        maxWidth: `${imageContent.scale * 100}%`,
      }"
      :class="{ 'cursor-pointer': editMode }"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { ImageContent } from '../../../../model/slide/content/ImageContent';

defineProps({
  imageContent: {
    /**
     * The image content to display
     */
    type: Object as PropType<ImageContent>,
    required: true,
  },
  /**
   * Indicates whether student or teacher is viewing the slide
   */
  editMode: {
    type: Boolean,
    required: true,
  },
});
</script>
