<template>
  <PopupComponent @closed="$emit('closed')">
    <ContainerComponent class="px-10 py-10 w-96">
      <template #Header>
        <h1 class="text-xl">
          {{ $t('create', { object: $t('sequence.sequence') }) }}:
        </h1>
      </template>
      <template #default>
        <div class="space-y-2">
          <TextInputComponent
            class="w-full"
            :disabled="disableInputShowSpinner"
            :placeHolder="$t('sequence.name')"
            v-model="nameField"
          />
          <ButtonComponent
            class="w-fit float-right"
            :loading="disableInputShowSpinner"
            @click="newSequence()"
          >
            {{ $t('createAction') }}
          </ButtonComponent>
        </div>
      </template>
    </ContainerComponent>
  </PopupComponent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SequenceRestInterface } from '../restInterfaces/SequenceRestInterface';
import PopupComponent from './PopupComponent.vue';
import TextInputComponent from '../components/TextInputComponent.vue';
import ButtonComponent from './ButtonComponent.vue';
import ContainerComponent from './ContainerComponent.vue';
import { useRouter } from 'vue-router';

defineEmits([
  /**
   * Emitted when the popup is closed
   */
  'closed',
]);

const disableInputShowSpinner = ref(false);
const nameField = ref('');
const error = ref(false);
const router = useRouter();

/**
 * Create a new sequence with given name
 */
async function newSequence(): Promise<void> {
  error.value = false;
  disableInputShowSpinner.value = true;
  try {
    const code = await SequenceRestInterface.addSequence(nameField.value);
    await router.push({ name: 'SequenceEdit', params: { sequenceCode: code } });
  } catch (e) {
    error.value = true;
    throw e;
  }
  disableInputShowSpinner.value = false;
}
</script>
