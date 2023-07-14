<template>
  <ContainerComponent>
    <template #Header>
      <h1 class="text-3xl mb-2">Seiten</h1>
    </template>
    <template #default>
      <div class="flex flex-col min-h-full">
        <VueDraggableNext :list="slides" @change="updateOrder()">
          <div
            class="mb-2 mr-2 flex flex-row space-x-2 items-center"
            v-for="[index, slide] in slides.entries()"
            :key="slide.id"
          >
            <p>{{ index + 1 }}</p>
            <SlideOverviewContainerElement
              :slide="slide"
              class="rounded-md"
              @click="$emit('selectionChanged', index)"
            />
          </div>
        </VueDraggableNext>
        <div class="flex-grow"></div>
        <ButtonComponent @click="$emit('addSlide')" class="w-full text-center">
          +
        </ButtonComponent>
      </div>
    </template>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { ISlide } from '../../../model/slide/ISlide';
import ContainerComponent from './ContainerComponent.vue';
import { VueDraggableNext } from 'vue-draggable-next';
import SlideOverviewContainerElement from './SlideOverviewContainerElement.vue';
import ButtonComponent from './ButtonComponent.vue';

const props = defineProps({
  slides: {
    type: Array<ISlide>,
    required: true,
  },
});

defineEmits(['selectionChanged', 'addSlide']);

/**
 * Updates the order of the slides after a drag and drop event
 */
function updateOrder(): void {
  for (let i = 0; i < props.slides.length; i++) {
    // eslint-disable-next-line vue/no-mutating-props
    props.slides[i].order = i;
  }
}
</script>
