<template>
  <slot></slot>
  <div class="relative">
    <div class="absolute bottom-0 right-0 w-80">
      <ul class="list-image-none">
        <li
          v-for="pair of errormessages.reverse()"
          :key="pair.index"
          class="p-1"
        >
          <Toast :message="pair.errorMessage" :time="errortimedisplayed" />
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onErrorCaptured, ref, Ref } from 'vue';
import Toast from './ToastComponent.vue';

interface ErrorIndexPair {
  index: number;
  errorMessage: string;
}

const errormessages: Ref<Array<ErrorIndexPair>> = ref([]);
const errortimedisplayed = 6000;
let index = 0;

onErrorCaptured((err, instance) => {
  void instance;
  errormessages.value.push({ index: index, errorMessage: err.message });
  const tbr = index;
  index++;
  setTimeout(() => {
    const i = errormessages.value.indexOf({
      index: tbr,
      errorMessage: err.message,
    });
    errormessages.value.splice(i, 1);
  }, errortimedisplayed);
  return false;
});
</script>
