<template>
  <div class="flex flex-row items-center space-x-5 w-full pt-5">
    <ButtonComponent @click="selectImage()">{{
      $t('change', { object: $t('content.image') })
    }}</ButtonComponent>
    <div class="text-error" v-if="errorCode !== ''">
      {{ $t(errorCode) }}
    </div>
    <div class="space-x-2 flex flex-row items-center w-96">
      <p>{{ $t('content.scale') }}:</p>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        v-model="refContent.scale"
        class="h-2 rounded-full appearance-none cursor-pointer bg-interactable-border grow"
        @change="updateScale()"
      />
      <p>{{ (refContent.scale * 100).toFixed(0) }}%</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import { ImageContent } from '../../../../model/slide/content/ImageContent';
import ButtonComponent from '../ButtonComponent.vue';

const props = defineProps({
  /**
   * The image content to edit
   */
  imageContent: {
    type: Object as PropType<ImageContent>,
    required: true,
  },
});

const emits = defineEmits([
  /**
   * Emitted when the content has been edited
   *
   * @param content the updated content
   */
  'update-content',
]);

const refContent = ref(props.imageContent);

const errorCode = ref('');

/**
 * Opens a file dialog to select a new image.
 */
function selectImage(): void {
  let input = document.createElement('input');
  input.type = 'file';
  input.accept = '.png,.jpg,.jpeg';
  input.multiple = false;
  input.onchange = (): void => {
    const files = input.files;
    if (!files) {
      return;
    }
    const file = files.item(0);
    if (!file) {
      errorCode.value = 'content.fileNotFound';
      return;
    }
    // Limits the file size to 2MB
    if (file.size > 2097152) {
      errorCode.value = 'content.fileTooLarge';
      return;
    }
    errorCode.value = '';
    imageToBase64(file);
  };
  input.click();
}

/**
 * Transforms an image to a base64 string and saves it to the content.
 * @param file File to transform
 */
function imageToBase64(file: File): void {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (): void => {
    if (typeof reader.result === 'string') {
      refContent.value.img = reader.result;
      emits('update-content', refContent.value);
    }
  };
}

/**
 * Updates the scale  of the image
 */
function updateScale(): void {
  emits('update-content', refContent.value);
}

watch(
  () => props.imageContent,
  () => {
    refContent.value = props.imageContent;
  }
);
</script>
