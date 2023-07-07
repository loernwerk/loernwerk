<!-- Visualizes a slide -->
<template>
  <div
    class="aspect-video p-5 rounded-md"
    :style="{ backgroundColor: slide.backgroundColor }"
  >
    <div class="grid grid-layout h-full" ref="wrapper">
      <ContentDisplayFactory
        v-for="slot in usedSlots"
        :key="slot.slot"
        :content="slide.content[slot.slot]"
        :style="slot.style"
        :edit-mode="editMode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { LayoutSlot, LayoutType } from '../../../../model/slide/layout/Layout';
import { ISlide } from '../../../../model/slide/ISlide';
import { PropType, Ref, computed, onMounted, provide, ref } from 'vue';
import ContentDisplayFactory from './ContentDisplayFactory.vue';

const props = defineProps({
  /**
   * The slide to display
   */
  slide: {
    type: Object as PropType<ISlide>,
    required: true,
  },
  /**
   * Indicates whether student or teacher is viewing the slide
   */
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

/**
 * The slots that are used in the current layout and their respective styles
 */
const usedSlots: Ref<{ slot: LayoutSlot; style: GridSlot }[]> = computed(() => {
  let slots: { slot: LayoutSlot; style: GridSlot }[] = [];
  const hasHeader =
    props.slide.layout === LayoutType.TWO_COLUMN_WITH_HEADER ||
    props.slide.layout === LayoutType.GRID_WITH_HEADER ||
    props.slide.layout === LayoutType.SINGLE_COLUMN_WITH_HEADER;

  if (hasHeader) {
    slots.push({
      slot: LayoutSlot.HEADER,
      style: {
        gridRowStart: 1,
        gridRowEnd: 2,
        gridColumnStart: 1,
        gridColumnEnd: 3,
      },
    });
  }

  switch (props.slide.layout) {
    case LayoutType.SINGLE_COLUMN_WITH_HEADER:
    case LayoutType.SINGLE_COLUMN:
      slots.push({
        slot: LayoutSlot.MAIN,
        style: {
          gridRowStart: 2,
          gridRowEnd: 4,
          gridColumnStart: 1,
          gridColumnEnd: 3,
        },
      });
      break;
    case LayoutType.TWO_COLUMN_WITH_HEADER:
    case LayoutType.TWO_COLUMN:
      slots.push({
        slot: LayoutSlot.MAIN,
        style: {
          gridRowStart: 2,
          gridRowEnd: 4,
          gridColumnStart: 1,
          gridColumnEnd: 2,
        },
      });
      slots.push({
        slot: LayoutSlot.SECONDARY,
        style: {
          gridRowStart: 2,
          gridRowEnd: 4,
          gridColumnStart: 2,
          gridColumnEnd: 3,
        },
      });
      break;
    case LayoutType.GRID_WITH_HEADER:
    case LayoutType.GRID:
      slots.push({
        slot: LayoutSlot.MAIN,
        style: {
          gridRowStart: 2,
          gridRowEnd: 3,
          gridColumnStart: 1,
          gridColumnEnd: 2,
        },
      });
      slots.push({
        slot: LayoutSlot.SECONDARY,
        style: {
          gridRowStart: 2,
          gridRowEnd: 3,
          gridColumnStart: 2,
          gridColumnEnd: 3,
        },
      });
      slots.push({
        slot: LayoutSlot.TERTIARY,
        style: {
          gridRowStart: 3,
          gridRowEnd: 4,
          gridColumnStart: 1,
          gridColumnEnd: 2,
        },
      });
      slots.push({
        slot: LayoutSlot.FOURARY,
        style: {
          gridRowStart: 3,
          gridRowEnd: 4,
          gridColumnStart: 2,
          gridColumnEnd: 3,
        },
      });
      break;
    case LayoutType.SIDEBAR:
      slots.push({
        slot: LayoutSlot.HEADER,
        style: {
          gridRowStart: 1,
          gridRowEnd: 2,
          gridColumnStart: 1,
          gridColumnEnd: 2,
        },
      });
      slots.push({
        slot: LayoutSlot.MAIN,
        style: {
          gridRowStart: 1,
          gridRowEnd: 4,
          gridColumnStart: 2,
          gridColumnEnd: 3,
        },
      });
      slots.push({
        slot: LayoutSlot.SECONDARY,
        style: {
          gridRowStart: 2,
          gridRowEnd: 4,
          gridColumnStart: 1,
          gridColumnEnd: 2,
        },
      });
      break;
    case LayoutType.TITLEPAGE:
      slots.push({
        slot: LayoutSlot.MAIN,
        style: {
          gridRowStart: 2,
          gridRowEnd: 4,
          gridColumnStart: 1,
          gridColumnEnd: 3,
        },
      });
      break;
  }

  return slots;
});

// responsive font size
const wrapper: Ref<HTMLElement | null> = ref(null);
const height = ref(0);
/**
 * Updates the global size of the current slide with the current height.
 */
function updateSizeProvide(): void {
  if (wrapper.value) {
    height.value = wrapper.value?.clientHeight;
  }
}
onMounted(() => {
  updateSizeProvide();
});
window.addEventListener('resize', () => {
  updateSizeProvide();
});
provide('slideHeight', height);
</script>

<style scoped>
.grid-layout {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: minmax(auto, 10%) 1fr 1fr;
}
</style>