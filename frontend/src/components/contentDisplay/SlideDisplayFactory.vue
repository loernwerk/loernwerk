<template>
  <div
    class="aspect-video p-5 rounded-md"
    :style="{ backgroundColor: slide.backgroundColor }"
  >
    <div class="grid grid-layout h-full">
      <ContenDisplayFactory
        v-for="slot in requiredSlots"
        :key="slot"
        :content="slide.content[slot]"
        :style="getSlotStyle(slot)"
        :edit-mode="editMode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Layout,
  LayoutSlot,
  LayoutType,
} from '../../../../model/slide/layout/Layout';
import { ISlide } from '../../../../model/slide/ISlide';
import { PropType } from 'vue';
import ContenDisplayFactory from './ContenDisplayFactory.vue';

const props = defineProps({
  slide: {
    type: Object as PropType<ISlide>,
    required: true,
  },

  editMode: {
    type: Boolean,
    required: true,
    default: false,
  },
});

interface GridSlot {
  gridRowStart: number;
  gridRowEnd: number;
  gridColumnStart: number;
  gridColumnEnd: number;
}

const map: Record<LayoutSlot, GridSlot> = {
  0: { gridRowStart: 1, gridRowEnd: 2, gridColumnStart: 1, gridColumnEnd: 3 },
  1: { gridRowStart: 2, gridRowEnd: 4, gridColumnStart: 1, gridColumnEnd: 2 },
  2: { gridRowStart: 2, gridRowEnd: 4, gridColumnStart: 2, gridColumnEnd: 3 },
  3: { gridRowStart: 2, gridRowEnd: 4, gridColumnStart: 2, gridColumnEnd: 3 },
  4: { gridRowStart: 2, gridRowEnd: 4, gridColumnStart: 2, gridColumnEnd: 3 },
};

/**
 * Gets the drid style for a given slot in the slides layout.
 *
 * @param slot Slot to check for
 * @returns Grid style for the slot
 */
function getSlotStyle(slot: LayoutSlot): GridSlot {
  const hasHeader =
    props.slide.layout === LayoutType.TWO_COLUMN_WITH_HEADER ||
    props.slide.layout === LayoutType.GRID_WITH_HEADER ||
    props.slide.layout === LayoutType.SINGLE_COLUMN_WITH_HEADER;
  if (hasHeader && slot === LayoutSlot.HEADER) {
    return {
      gridRowStart: 1,
      gridRowEnd: 2,
      gridColumnStart: 1,
      gridColumnEnd: 3,
    };
  } else if (
    slot == LayoutSlot.HEADER &&
    props.slide.layout === LayoutType.TITLEPAGE
  ) {
    return {
      gridRowStart: 1,
      gridRowEnd: 4,
      gridColumnStart: 1,
      gridColumnEnd: 3,
    };
  }

  return map[slot];

  //if (props.slide.layout === LayoutType.TWO_COLUMN_WITH_HEADER || props.slide.layout === LayoutType.TWO_COLUMN) {

  //} else if (props.slide.layout === LayoutType.SINGLE_COLUMN_WITH_HEADER || props.slide.layout === LayoutType.SINGLE_COLUMN) {

  //} else if (props.slide.layout === LayoutType.GRID_WITH_HEADER || props.slide.layout === LayoutType.GRID) {

  //}

  //eturn { gridRowStart: 1, gridRowEnd: 1, gridColumnStart: 1, gridColumnEnd: 1};
}

const requiredSlots = Layout.getLayoutSlots(props.slide.layout);
</script>

<style scoped>
.grid-layout {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr 1fr;
}
</style>
