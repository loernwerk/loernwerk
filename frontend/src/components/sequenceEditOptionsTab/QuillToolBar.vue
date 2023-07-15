<template>
  <div
    :id="`q-toolbar-${id}`"
    class="flex space-x-7 pt-5 items-center"
    ref="root"
  >
    <span class="flex space-x-2 items-center">
      <select class="ql-size interactable h-fit w-32">
        <option
          v-for="size in sizes"
          :key="(size as string)"
          :value="size !== defaultTextSize ? size : null"
          :size="size"
        >
          {{ size }}
        </option>
      </select>

      <span class="flex space-x-1 items-center">
        <ButtonComponent @click="showColorPicker = !showColorPicker">
          <FontAwesomeIcon :icon="['fas', 'palette']" />
        </ButtonComponent>
        <span
          class="space-x-1 interactable !flex-row w-fit !h-fit"
          :class="{ hidden: !showColorPicker }"
        >
          <button
            v-for="color in colors"
            :key="color"
            :style="{ backgroundColor: color }"
            class="aspect-square h-4 w-4 ql-color border-1 border-black cursor-pointer text-transparent"
            :value="color"
          ></button>
        </span>
      </span>

      <select class="ql-font interactable h-fit items-center w-96">
        <option
          v-for="font in fontFamilies"
          :key="font"
          :value="font !== defaultFontFamily ? font : null"
          :font="font"
        >
          {{ font }}
        </option>
      </select>
    </span>

    <span class="flex space-x-2">
      <button class="ql-bold interactable h-fit">
        <FontAwesomeIcon :icon="['fas', 'bold']" />
      </button>
      <button class="ql-italic interactable h-fit">
        <FontAwesomeIcon :icon="['fas', 'italic']" />
      </button>
      <button class="ql-underline interactable h-fit">
        <FontAwesomeIcon :icon="['fas', 'underline']" />
      </button>
    </span>

    <span class="flex space-x-2">
      <button class="ql-align interactable h-fit" value="" type="button">
        <FontAwesomeIcon :icon="['fas', 'align-left']" />
      </button>
      <button class="ql-align interactable h-fit" value="center" type="button">
        <FontAwesomeIcon :icon="['fas', 'align-center']" />
      </button>
      <button class="ql-align interactable h-fit" value="right" type="button">
        <FontAwesomeIcon :icon="['fas', 'align-right']" />
      </button>
    </span>
  </div>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import {
  faBold,
  faItalic,
  faUnderline,
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faPalette,
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  sizes,
  colors,
  fontFamilies,
  defaultTextSize,
  defaultFontFamily,
} from '../contentDisplay/DesignOptions';
import ButtonComponent from '../ButtonComponent.vue';

library.add(
  faBold,
  faItalic,
  faUnderline,
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faPalette
);

defineProps({
  id: {
    type: String,
    required: true,
  },
});

const showColorPicker = ref(false);
const root: Ref<HTMLElement | null> = ref(null);

onMounted(() => {
  const realRoot = root.value;
  if (!realRoot) return;
  realRoot
    .querySelector(`.ql-size > option[size="${defaultTextSize}"]`)
    ?.toggleAttribute('selected', true);
  realRoot
    .querySelector(`.ql-font > option[font="${defaultFontFamily}"]`)
    ?.toggleAttribute('selected', true);
});
</script>
