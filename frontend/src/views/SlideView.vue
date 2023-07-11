<!-- View for execution of a sequence -->
<template>
  <div class="flex w-full flex-col content-center">
    <div class="flex flex-grow justify-center">
      <SlideDisplayFactory
        v-if="slide != null && !error"
        :slide="slide"
        :editMode="false"
        :key="index"
      >
      </SlideDisplayFactory>
      <div class="text-red-500" v-if="error">
        Es ist ein Fehler bei der Folien Ansicht aufgetreten. Bitte laden sie
        die Seite erneut.
      </div>
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
import { ISequence } from '../../../model/sequence/ISequence';

const route = useRoute();
const router = useRouter();
const displaySpinner = ref(false);
const percentage = ref(0);
const slide: Ref<ISlide | null> = ref(null);
const index = ref(0);
const error = ref(false);

let sequence: Partial<ISequence>;
try {
  sequence = await SequenceRestInterface.getMetadataForStudent(
    route.params.code as string
  );
  await nextSlideToExecute();
} catch {
  router.push({ name: 'Main' });
}

/**
 * Get next slide for execution
 */
async function nextSlideToExecute(): Promise<void> {
  displaySpinner.value = true;

  if (index.value == sequence.slideCount) {
    router.push({ name: 'Finished', params: { code: sequence.code } });
    return;
  }
  try {
    slide.value = await SequenceRestInterface.getSlide(
      sequence.code as string,
      index.value
    );
  } catch {
    error.value = true;
  }

  percentage.value = index.value / (sequence.slideCount as number);
  index.value = index.value + 1;
  displaySpinner.value = false;
}
</script>
