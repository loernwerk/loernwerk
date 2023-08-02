<template>
  <div class="h-full w-full">
    <div v-if="editMode" class="h-full">
      <div class="absolute" v-if="isEditorOpen">
        <ContainerComponent class="fixed top-3 bottom-3 left-3 right-3 z-10">
          <InteractableComponent class="w-fit mb-3">
            <select v-model="toEdit" class="text-xl">
              <option selected value="new">
                {{ $t('h5p.createNewContent') }}
              </option>
              <option
                v-for="content in reusable"
                :key="content.contentId"
                :value="content.contentId"
                class="text-xl"
              >
                {{ content.title }} ({{ content.mainLibrary }},
                {{
                  $t('h5p.usedBy', { object: content.usedSequences.length })
                }})
              </option>
            </select>
          </InteractableComponent>
          <H5PEditor
            :content-id="toEdit"
            :key="toEdit"
            @closed="(id) => saveEditor(id)"
          />
        </ContainerComponent>
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
            {{ $t('h5p.clickToEdit') }}
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
import { PropType, Ref, ref } from 'vue';
import { H5PContent } from '../../../../model/slide/content/H5PContent';
import H5PEditor from './H5PEditor.vue';
import H5PPlayer from './H5PPlayer.vue';
import { H5PRestInterface } from '../../restInterfaces/H5PRestInterface';
import ContainerComponent from '../ContainerComponent.vue';
import InteractableComponent from '../InteractableComponent.vue';

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
const toEdit = ref(props.h5pContent.h5pContentId);
const reusable: Ref<
  {
    title: string;
    mainLibrary: string;
    contentId: string;
    usedSequences: string[];
  }[]
> = ref([]);

if (props.editMode) {
  reusable.value = await H5PRestInterface.getH5PContentList();
}

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
