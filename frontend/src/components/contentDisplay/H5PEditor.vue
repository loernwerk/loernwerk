<template>
  <h5p-editor ref="editor" :content-id="contentId" />
</template>

<script setup lang="ts">
import { IContentMetadata, IEditorModel } from '@lumieducation/h5p-server';
import {
  defineElements,
  H5PEditorComponent,
} from '@lumieducation/h5p-webcomponents';
import { onMounted, Ref, ref, toRefs } from 'vue';
import { H5PRestInterface } from '../../restInterfaces/H5PRestInterface';

const props = defineProps({
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

const { sequenceCode } = toRefs(props);

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
      return await H5PRestInterface.getH5PContent(contentId);
    };

    h5pEditor.saveContentCallback = async (
      contentId: string,
      requestBody: { library: string; params: unknown }
    ): Promise<{ contentId: string; metadata: IContentMetadata }> => {
      if (contentId === undefined || contentId === 'undefined') {
        return await H5PRestInterface.createH5PContent(
          sequenceCode.value,
          requestBody
        );
      } else {
        return await H5PRestInterface.editH5PContent(contentId, requestBody);
      }
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
