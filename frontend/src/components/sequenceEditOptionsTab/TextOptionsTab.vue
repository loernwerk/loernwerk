<template>
  <div class="flex flex-row items-center space-x-5 w-full pt-5">
    <div class="flex flex-row items-center space-x-2">
      <p>Schriftart:</p>
      <select></select>
    </div>

    <div class="flex flex-row items-center space-x-2">
      <p>Schriftgrröße:</p>
      <select></select>
    </div>

    <div class="flex flex-row items-center space-x-2">
      <p>Schriftfarbe:</p>
      <input type="color" @change="(val) => console.log(val)" />
    </div>

    <div class="flex flex-row items-center space-x-2">
      <FontAwesomeIcon :icon="['fas', 'bold']" class="cursor-pointer" />
      <FontAwesomeIcon :icon="['fas', 'italic']" class="cursor-pointer" />
      <FontAwesomeIcon :icon="['fas', 'underline']" class="cursor-pointer" />
    </div>

    <div class="flex flex-row items-center space-x-2">
      <FontAwesomeIcon :icon="['fas', 'align-left']" class="cursor-pointer" />
      <FontAwesomeIcon :icon="['fas', 'align-center']" class="cursor-pointer" />
      <FontAwesomeIcon :icon="['fas', 'align-right']" class="cursor-pointer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { TextContent } from '../../../../model/slide/content/TextContent';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faBold,
  faItalic,
  faUnderline,
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(
  faBold,
  faItalic,
  faUnderline,
  faAlignCenter,
  faAlignLeft,
  faAlignRight
);

defineProps({
  textContent: {
    type: Object as PropType<TextContent>,
    required: true,
  },
});
</script>
