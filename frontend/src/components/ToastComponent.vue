<template>
  <ContainerComponent class="bg-red-500 border-red-700">
    <div class="text-white text-center">
      {{ $t('error.' + message) }}
    </div>
    <div class="h-2 w-full bg-red-400">
      <div
        class="h-2 bg-red-600 p-0.5 text-center text-xs font-medium leading-none text-white"
        :style="{ width: timeperc + '%' }"
      ></div>
    </div>
  </ContainerComponent>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import ContainerComponent from './ContainerComponent.vue';

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
});
const time = ref(props.time);
const timeperc = ref(100);

setInterval(() => {
  time.value -= 10;
  timeperc.value = (time.value / props.time) * 100;
}, 10);
</script>
