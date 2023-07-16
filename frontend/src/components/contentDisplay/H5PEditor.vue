<template>
  <h5p-editor ref="editor" :content-id="contentId" />
  <div class="flex items-center">
    <ButtonComponent class="w-fit" :loading="currentlySaving" @click="save"
      >Save</ButtonComponent
    >
    <ButtonComponent class="w-fit ml-1" @click="close">Close</ButtonComponent>
  </div>
</template>

<script setup lang="ts">
import { IContentMetadata, IEditorModel } from '@lumieducation/h5p-server';
import {
  defineElements,
  H5PEditorComponent,
} from '@lumieducation/h5p-webcomponents';
import { onMounted, Ref, ref } from 'vue';
import { H5PRestInterface } from '../../restInterfaces/H5PRestInterface';
import ButtonComponent from '../ButtonComponent.vue';

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

const currentlySaving = ref(false);

const emits = defineEmits([
  /**
   * Emitted when the editor is closed
   *
   * @param h5pId Id of the Content that was edited
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
          props.sequenceCode as string,
          requestBody
        );
      } else {
        return await H5PRestInterface.editH5PContent(contentId, requestBody);
      }
    };
  }
});

/**
 * Saves the current state of the H5P editor.
 */
async function save(): Promise<void> {
  currentlySaving.value = true;
  const { contentId } = await (editor.value as H5PEditorComponent).save();
  emits('closed', contentId);
}

/**
 * Closes the editor without prior saving.
 */
function close(): void {
  emits('closed', undefined);
}

window.addEventListener('resize', () => {
  const h5pEditor = editor.value;
  if (h5pEditor !== null) {
    h5pEditor.resize();
  }
});
</script>
