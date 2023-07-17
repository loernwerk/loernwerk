<template>
  <PopupComponent>
    <ContainerComponent>
        <h1 class="underline text-xl">Name der neuen Sequenz:</h1>    
        
        <TextInputComponent
            class="w-full my-4"
            :disabled="disableInputShowSpinner"
            placeHolder="Name der Sequenz"
            @input-changed="(val) => (nameField = val)"
        />
        
        <ButtonComponent
            class="w-fit float-right"
            :loading="disableInputShowSpinner"
            @click="newSequence()"
        >
        Sequenz erstellen
        </ButtonComponent>

    </ContainerComponent>
  </PopupComponent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SequenceRestInterface } from '../restInterfaces/SequenceRestInterface';
import PopupComponent from './PopupComponent.vue';
import ContainerComponent from './ContainerComponent.vue';
import TextInputComponent from '../components/TextInputComponent.vue';
import ButtonComponent from './ButtonComponent.vue';


const disableInputShowSpinner = ref(false);
const nameField = ref('');

async function newSequence() : Promise<void> {
    disableInputShowSpinner.value = true
  try {
    const code = await SequenceRestInterface.addSequence(nameField.value);
    alert('SequenceEditView')
  } catch {
    alert('Error')
  }
  disableInputShowSpinner.value = false;
}

</script>