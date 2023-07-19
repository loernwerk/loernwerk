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
        {{ $t('notAvailable', { object: $t('slide') }) }} {{ $t('reloadPage') }}
      </div>
    </div>
    <div class="flex items-center">
      <div class="w-full mr-4">
        <ProgressBar :percentage="percentage"> </ProgressBar>
      </div>
      <ButtonComponent
        class="w-fit"
        :loading="displaySpinner"
        @click="nextSlideToExecute()"
      >
        {{ $t('next') }}
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
import { useRouter } from 'vue-router';
import { ISlide } from '../../../model/slide/ISlide';
import { ISequence } from '../../../model/sequence/ISequence';

const props = defineProps({
  /**
   * Sequence code to get meta data
   */
  sequenceCode: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const displaySpinner = ref(false);
const percentage = ref(0);
const slide: Ref<ISlide | null> = ref(null);
const index = ref(0);
const error = ref(false);

let sequence: Partial<ISequence>;
try {
  sequence = await SequenceRestInterface.getMetadataForStudent(
    props.sequenceCode
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
    await router.push({
      name: 'Finished',
      params: { sequenceCode: sequence.code },
    });
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
