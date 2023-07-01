<!-- Displays an embed content. -->
<template>
  <iframe :src="embedContent.url" class="h-full w-full" />
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { EmbedContent } from '../../../../model/slide/content/EmbedContent';

defineProps({
  /**
   * The embed content to display
   */
  embedContent: {
    type: Object as PropType<EmbedContent>,
    required: true,
  },
});
</script>
