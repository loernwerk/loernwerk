<template>
  <div id="toolbar" class="flex space-x-5">
    <span class="flex space-x-2">
      <select class="ql-size interactable h-fit">
        <option
          v-for="size in firstSizes"
          :key="(size as string)"
          :value="size"
        >
          {{ size }}
        </option>
        <option selected>{{ defaultTextSize }}</option>
        <option
          v-for="size in secondSizes"
          :key="(size as string)"
          :value="size"
        >
          {{ size }}
        </option>
      </select>

      <span class="flex space-x-2">
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

      <select class="ql-font interactable h-fit">
        <option selected ref="defaultFontOption"></option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
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
import { ref } from 'vue';
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
  defaultTextSize,
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

const indexOfDefaultTextSize = sizes.indexOf(defaultTextSize);
const secondSizes = sizes.slice(indexOfDefaultTextSize + 1);
const firstSizes = sizes.slice(0, indexOfDefaultTextSize);

const showColorPicker = ref(false);
</script>

<style scoped>
.test::after {
  content: 'test';
}
</style>
