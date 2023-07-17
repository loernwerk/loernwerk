<template>
  <ContainerComponent>
    Schlüsselwörter der Sequenz (mit ";" getrennt):
    <TextInputComponent
      class="my-2"
      placeHolder="Schlüsselwörter"
      v-model="tagsField"
    >
    </TextInputComponent>
    <ButtonComponent class="w-fit float-right" @click="confimChanges"
      >Bestätigen</ButtonComponent
    >
  </ContainerComponent>
</template>

<script setup lang="ts">
import TextInputComponent from '../TextInputComponent.vue';
import ButtonComponent from '../ButtonComponent.vue';
import ContainerComponent from '../ContainerComponent.vue';
import { ref } from 'vue';

const props = defineProps({
  /**
   * All existing tags as an string
   */
  tags: {
    type: Array<string>,
    required: true,
  },
});

const tagsField = ref(props.tags.join(';'));

const emits = defineEmits([
  /**
   * Emitted when user confirms input
   * @param tags existing tags for the sequence
   */
  'confirmed',
]);

/**
 * Save inputted tags
 */
function confimChanges(): void {
  emits('confirmed', tagsField.value.split(';'));
}
</script>
