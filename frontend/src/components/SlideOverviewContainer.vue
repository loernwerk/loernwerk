<template>
  <ContainerComponent>
    <template #Header>
      <h1 class="text-3xl">Seiten</h1>
    </template>
    <template #default>
      <div class="flex flex-col min-h-full pt-2">
        <VueDraggableNext :list="slides" @change="$emit('orderChanged')">
          <div
            class="mb-2 mr-2 flex flex-row space-x-2 items-center"
            v-for="[index, slide] in slides.entries()"
            :key="slide.id"
          >
            <p>{{ index + 1 }}</p>
            <SlideOverviewContainerElement
              :slide="slide"
              class="rounded-md border-1"
              :class="{ 'border-4': index == selectedSlideIndex }"
              :style="{ 'border-color': slide.backgroundColor }"
              @click="$emit('selectionChanged', index)"
              @delete="$emit('deleteSlide', index)"
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

defineProps({
  slides: {
    type: Array<ISlide>,
    required: true,
  },

  selectedSlideIndex: {
    type: Number,
    required: true,
  },
});

defineEmits(['selectionChanged', 'addSlide', 'deleteSlide', 'orderChanged']);
</script>