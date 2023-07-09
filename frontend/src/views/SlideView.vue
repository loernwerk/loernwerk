<!-- View for execution of a sequence -->
<template>
  <div class="flex w-full flex-col content-center">
    <div class="flex flex-grow justify-center">
      <SlideDisplayFactory
        v-if="slide != null"
        :slide="slide"
        :editMode="false"
        :key="index"
      >
      </SlideDisplayFactory>
    </div>
    <div class="flex items-center">
      <div class="w-full mr-4">
        <ProgressBar :percentage="percentage"> </ProgressBar>
      </div>
      <ButtonComponent
        class="w-fit"
        :loading="displaySpinner"
        @click="nextSlideToExecute"
      >
        Weiter
      </ButtonComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import ButtonComponent from '../components/ButtonComponent.vue';
import ProgressBar from '../components/ProgressBar.vue';
import SlideDisplayFactory from '../components/contentDisplay/SlideDisplayFactory.vue';
import { SequenceRestInterface } from '../restInterfaces/SequenceRestInterface';
import { useRoute, useRouter } from 'vue-router';
import { ISlide } from '../../../model/slide/ISlide';

const route = useRoute();
const router = useRouter();
const displaySpinner = ref(false);
const percentage = ref(0);
const slide: Ref<ISlide | null> = ref(null);
const index = ref(0);

const sequence = await SequenceRestInterface.getMetadataForStudent(
  route.params.code as string
);
await nextSlideToExecute();

/**
 * Get next slide for execution
 */
async function nextSlideToExecute(): Promise<void> {
  displaySpinner.value = true;

  try {
    slide.value = await SequenceRestInterface.getSlide(
      sequence.code as string,
      index.value
    );
  } catch {
    router.push({ name: 'Finished', params: { code: sequence.code } });
  }

  percentage.value = index.value / (sequence.slideCount as number);
  index.value = index.value + 1;
  displaySpinner.value = false;
}
</script>
