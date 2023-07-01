<!-- Displays an embed content in the editor. -->
<template>
  <div class="w-full h-full cursor-pointer" @click="$emit('editing')">
    <EmbedDisplay :embed-content="embedContent" class="pointer-events-none" />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { EmbedContent } from '../../../../model/slide/content/EmbedContent';
import EmbedDisplay from './EmbedDisplay.vue';

defineProps({
  embedContent: {
    /**
     * The embed content to display
     */
    type: Object as PropType<EmbedContent>,
    required: true,
  },
});

defineEmits(['editing']);
</script>
