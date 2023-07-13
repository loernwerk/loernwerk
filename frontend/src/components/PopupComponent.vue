<template>
  <div class="popup" v-if="isOpen">
    <div class="popupcontent">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';
import ButtonComponent from './ButtonComponent.vue';
import useEventsBus from './../eventBus';
const { bus } = useEventsBus()
let isOpen = ref(false)
watch(()=>bus.value.get('open-popup'), () => {
  isOpen.value = true
  console.log(isOpen)
})
const emit = defineEmits(['closed']);

;

// const togglePopUp = () => {
//   if(!isOpen.value) {
//     emit('closed');
//   }
//   isOpen.value = !isOpen.value;
// }
</script>
