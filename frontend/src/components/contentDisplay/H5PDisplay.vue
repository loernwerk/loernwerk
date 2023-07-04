<template>
  <div class="h-full">
    <div v-if="editMode" class="h-full">
      <div class="absolute" v-if="isEditorOpen">
        <H5PEditor
          :content-id="h5pContent.h5pContentId"
          @closed="isEditorOpen = false"
        />
      </div>

      <div class="h-full cursor-pointer flex p-5" @click="openEditor()">
        <div class="w-full flex flex-col justify-center items-center">
          <img src="../../assets/h5p.png" class="w-3/4" />
          <p class="text-center text-2xl mt-5">
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

const emits = defineEmits(['editing']);

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
</script>
