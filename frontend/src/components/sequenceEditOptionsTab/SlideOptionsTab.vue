<template>
  <div class="flex flex-row space-x-5 w-full pt-5">
    <div class="flex flex-row space-x-5 grow items-start">
      <div class="border-r-1 pr-2 border-container-border items-start">
        <div class="flex items-center space-x-2">
          <p>{{ $t('content.sequenceName') }}:</p>
          <TextInputComponent
            :start-text="sequence.name"
            v-model="sequenceName"
          />
        </div>
      </div>
      <div class="flex space-x-2 items-center">
        <p>{{ $t('content.background') }}:</p>
        <input
          type="color"
          :value="slide.backgroundColor"
          @change="val => updateSlideBackgroundColor((val.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import { ISlide } from '../../../../model/slide/ISlide';
import TextInputComponent from '../TextInputComponent.vue';
import { ISequence } from '../../../../model/sequence/ISequence';

const props = defineProps({
  /**
   * The slide being edited
   */
  slide: {
    type: Object as PropType<ISlide>,
    required: true,
  },

  /**
   * The sequence being edited
   */
  sequence: {
    type: Object as PropType<ISequence>,
    required: true,
  },
  disableButton: {
    type: Boolean,
    required: true,
  },
});

const emits = defineEmits([
  /**
   * Emitted when the slide has been updated
   *
   * @param slide The updated slide
   */
  'update-slide',
  /**
   * Emitted when the sequence has been updated
   *
   * @param sequence The updated sequence
   */
  'update-sequence',
]);
const sequenceName = ref(props.sequence.name);
watch(sequenceName, () => updateSequenceName(sequenceName.value));

/**
 * Sends the updated sequence
 * @param sequence The new Sequence
 */
function updateSequence(sequence: ISequence): void {
  emits('update-sequence', sequence);
}

/**
 * Sends the updated slide
 * @param slide The new slide
 */
function updateSlide(slide: ISlide): void {
  emits('update-slide', slide);
}

/**
 * Updates the name of the sequence
 * @param name The new name of the sequence
 */
function updateSequenceName(name: string): void {
  const tempSequence = props.sequence;
  tempSequence.name = name;
  updateSequence(tempSequence);
}

/**
 * Updates the background color of the slide
 * @param color The new background color of the slide
 */
function updateSlideBackgroundColor(color: string): void {
  const tempSlide = props.slide;
  tempSlide.backgroundColor = color;
  updateSlide(tempSlide);
}
</script>
