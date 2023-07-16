<template>
  <div class="relative">
    <div
      class="h-24 aspect-video cursor-pointer"
      :style="{ backgroundColor: slide.backgroundColor }"
      @click="(e) => $emit('click', e)"
    ></div>
    <div class="relative">
      <div class="absolute -top-[6.5rem] -right-1">
        <FontAwesomeIcon
          class="cursor-pointer"
          :icon="['fas', 'circle-xmark']"
          @click="$emit('delete')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { ISlide } from '../../../model/slide/ISlide';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faCircleXmark);

defineProps({
  slide: {
    type: Object as PropType<ISlide>,
    required: true,
  },
});

defineEmits(['click', 'delete']);
</script>
