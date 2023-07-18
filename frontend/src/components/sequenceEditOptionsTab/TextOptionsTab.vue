<template>
  <QuillToolBar
    v-for="slot in LayoutSlot"
    :key="slot"
    :id="slot.toString()"
    v-show="selectedSlot == slot"
  />
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import QuillToolBar from './QuillToolBar.vue';
import { LayoutSlot } from '../../../../model/slide/layout/Layout';

defineProps({
  /**
   * The currently selected slot
   */
  selectedSlot: {
    type: Number as PropType<LayoutSlot>,
    required: false,
  },
});
</script>
