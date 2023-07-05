<template>
  <h5p-editor ref="editor" :content-id="contentId" />
</template>

<script setup lang="ts">
import { IContentMetadata, IEditorModel } from '@lumieducation/h5p-server';
import {
  defineElements,
  H5PEditorComponent,
} from '@lumieducation/h5p-webcomponents';
import { onMounted, Ref, ref } from 'vue';

defineProps({
  /**
   * The h5p content to display
   */
  contentId: {
    type: String,
    required: true,
  },

  /**
   * Code of sequence it belongs to
   */
  sequenceCode: {
    type: String,
    required: true,
  },
});

const emits = defineEmits([
  /**
   * Emitted when the editor is closed
   */
  'closed',
]);

defineElements('h5p-editor');
const editor: Ref<H5PEditorComponent | null> = ref(null);

onMounted(() => {
  const h5pEditor = editor.value;
  if (h5pEditor !== null) {
    h5pEditor.loadContentCallback = async (
      contentId: string
    ): Promise<IEditorModel> => {
      // TODO
      throw new Error('Error getting content with id: ' + contentId);
    };

    h5pEditor.saveContentCallback = async (
      contentId: string,
      requestBody: { library: string; params: unknown }
    ): Promise<{ contentId: string; metadata: IContentMetadata }> => {
      // TODO
      console.log(requestBody);
      throw new Error('Error saving content with id: ' + contentId);
    };

    h5pEditor.disconnectedCallback = (): void => {
      emits('closed');
    };
  }
});

window.addEventListener('resize', () => {
  const h5pEditor = editor.value;
  if (h5pEditor !== null) {
    h5pEditor.resize();
  }
});
</script>
