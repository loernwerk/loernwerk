<template>
  <div
    class="h-24 aspect-video cursor-pointer"
    :style="{ backgroundColor: slide.backgroundColor }"
    @click="(e) => $emit('click', e)"
  ></div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { ISlide } from '../../../model/slide/ISlide';

defineProps({
  slide: {
    type: Object as PropType<ISlide>,
    required: true,
  },
});

defineEmits(['click']);
</script>
