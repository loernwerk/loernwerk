<template>
  <div class="flex flex-row items-center space-x-5 w-full pt-5">
    <ButtonComponent @click="selectImage()">Bild ändern</ButtonComponent>
    <div class="space-x-2 flex flex-row items-center w-96">
      <p>Skalierung:</p>
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
import { PropType, ref } from 'vue';
import { ImageContent } from '../../../../model/slide/content/ImageContent';
import ButtonComponent from '../ButtonComponent.vue';

const props = defineProps({
  imageContent: {
    type: Object as PropType<ImageContent>,
    required: true,
  },
});

const emits = defineEmits(['update-content']);

const refContent = ref(props.imageContent);

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
      return;
    }
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
</script>
