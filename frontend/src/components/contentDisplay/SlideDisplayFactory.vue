<!-- Visualizes a slide -->
<template>
  <div
    class="aspect-video h-full p-5 rounded-md"
    :style="{ backgroundColor: slide.backgroundColor }"
  >
    <div class="grid h-full" ref="wrapper" :style="gridTemplate">
      <ContentDisplayFactory
        v-for="slot in usedSlots"
        :layout-slot="slot.slot"
        :key="slot.slot"
        :content="slide.content[slot.slot]"
        :style="slot.style"
        :edit-mode="editMode"
        @editing="(val) => $emit('editing', { slot: slot.slot, emit: val })"
        @change-content="
          (type) => $emit('changeContent', { slot: slot.slot, type: type })
        "
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
import { computed, onMounted, PropType, provide, Ref, ref } from 'vue';
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

defineEmits([
  /**
   * Emitted when the user starts or stops editing a slide
   *
   * @param val Slot and value from component
   */
  'editing',
  /**
   * Emitted when the user changes the content of a slide
   *
   * @param val Slot and content to change to
   */
  'changeContent',
]);

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
  if (props.slide.layout == LayoutType.TITLEPAGE) {
    return [
      {
        slot: LayoutSlot.MAIN,
        style: {
          gridRowStart: 2,
          gridRowEnd: 3,
          gridColumnStart: 1,
          gridColumnEnd: 3,
        },
      },
    ];
  }

  let slots: { slot: LayoutSlot; style: GridSlot }[] = [];

  // Sidebar has a non standard header which is added seperately
  if (
    Layout.hasHeader(props.slide.layout) &&
    props.slide.layout !== LayoutType.SIDEBAR
  ) {
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
  }

  return slots;
});

const gridTemplate = computed(() => {
  if (props.slide.layout == LayoutType.TITLEPAGE) {
    return {
      gridTemplateRows: '1fr 1fr 1fr',
      gridTemplateColumns: '1fr 1fr',
    };
  }
  return {
    gridTemplateRows: `${
      Layout.hasHeader(props.slide.layout) ? '10%' : '0'
    } 1fr 1fr`,
    gridTemplateColumns: '1fr 1fr',
  };
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
