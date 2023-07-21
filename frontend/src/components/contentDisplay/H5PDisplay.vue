<template>
  <div class="h-full w-full">
    <div v-if="editMode" class="h-full">
      <div class="absolute" v-if="isEditorOpen">
        <H5PEditor
          :content-id="h5pContent.h5pContentId"
          :sequence-code="h5pContent.sequenceCode"
          @closed="(id) => saveEditor(id)"
        />
      </div>

      <div
        class="h-full cursor-pointer flex p-5 w-full"
        @click="openEditor()"
        v-else
      >
        <div class="w-full flex flex-col justify-center items-center mx-auto">
          <img
            src="../../assets/h5p.png"
            class="max-w-[75%] max-h-[50%] w-auto h-auto"
          />
          <p class="text-center text-base mt-5 text-black">
            Klicke um den Inhalt zu bearbeiten
          </p>
        </div>
      </div>
    </div>

    <div v-else class="h-full">
      <H5PPlayer :content-id="h5pContent.h5pContentId" class="h-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { H5PContent } from '../../../../model/slide/content/H5PContent';
import H5PEditor from './H5PEditor.vue';
import H5PPlayer from './H5PPlayer.vue';

const props = defineProps({
  /**
   * The h5p content to display
   */
  h5pContent: {
    type: Object as PropType<H5PContent>,
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

const isEditorOpen = ref(false);

/**
 * Opens the editor
 */
function openEditor(): void {
  if (props.editMode) {
    isEditorOpen.value = true;
    emits('editing');
  }
}

/**
 * Saves the editor and returns the new content id to the backend
 * @param id ID to return. Is undefined, if the editor was closed without saving.
 */
function saveEditor(id: string | undefined): void {
  if (props.editMode) {
    isEditorOpen.value = false;
    if (id !== undefined) {
      emits('editing', id);
    }
  }
}
</script>
