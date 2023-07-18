<!-- Displays an embed content in the editor. -->
<template>
  <div class="w-full h-full cursor-pointer" @click="emitEdit()">
    <iframe
      :src="embedContent.url"
      class="h-full w-full"
      :class="{ 'pointer-events-none': editMode }"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { EmbedContent } from '../../../../model/slide/content/EmbedContent';

const props = defineProps({
  /**
   * The embed content to display
   */
  embedContent: {
    type: Object as PropType<EmbedContent>,
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

const emits = defineEmits([
  /**
   * Emitted when the content is being edited
   */
  'editing',
]);

/**
 * Emits an editing event
 */
function emitEdit(): void {
  if (props.editMode) {
    emits('editing');
  }
}
</script>
