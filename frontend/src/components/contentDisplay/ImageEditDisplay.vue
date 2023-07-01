<!-- Displays an image content for editing -->
<template>
  <ImageDisplay
    :image-content="imageContent"
    class="cursor-pointer"
    @click="$emit('editing')"
  />
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { ImageContent } from '../../../../model/slide/content/ImageContent';
import ImageDisplay from './ImageDisplay.vue';

defineProps({
  imageContent: {
    /**
     * The image content to display
     */
    type: Object as PropType<ImageContent>,
    required: true,
  },
});

defineEmits(['editing']);
</script>
