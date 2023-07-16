<template>
  <div
    class="fixed z-[99] bg-[rgba(0,0,0,0.2)] flex items-center justify-center inset-0"
    v-if="isOpen"
  >
    <div class="popupcontent">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import useEventsBus from './../eventBus';
const { bus } = useEventsBus();
let isOpen = ref(false);
//const emit = defineEmits(['closed']);

watch(
  () => bus.value.get('open-menu'),
  () => {
    isOpen.value = true;
    console.log(isOpen);
  }
);

watch(
  () => bus.value.get('close'),
  () => {
    isOpen.value = false;
    console.log(isOpen);
    //emit('closed');
  }
);
</script>
