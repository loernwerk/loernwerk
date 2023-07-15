<template>
  <ContainerComponent>
    <h1>Geben Sie den Nutzernamen der Lehrkraft ein, mit der die Sequenz geteilt werden soll:</h1>
    <TextInputComponent
        @input-changed="(text) => (userInfoField = text)"
        :class="{ 'border-red-600': showRedBorder }">
    </TextInputComponent>
    <ButtonComponent @click="confirmSharing">Teilen</ButtonComponent>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ContainerComponent from '../ContainerComponent.vue';
import TextInputComponent from "../TextInputComponent.vue";
import {toRaw, watch} from "vue";
import useEventsBus from "../../eventBus";
import {AccountRestInterface} from "../../restInterfaces/AccountRestInterface";
import ButtonComponent from "../ButtonComponent.vue";
import {ref} from "vue";
const { bus } = useEventsBus();
const { emit }=useEventsBus();

let userInfoField = ref('');
let sequenceToBeShared;
let accounts;
let showRedBorder = ref(false);

watch(()=>bus.value.get('sequence'), (sequence) => {
  sequenceToBeShared = toRaw(sequence)[0];
});

async function confirmSharing() {
  if(userInfoField.value.length == 0) {
    emit('userInfoEmpty');
    showRedBorder.value = true;
  }
    else{
    try {
      //accounts = await AccountRestInterface.getAccountMetaDataList();
      for (let i = 0; i < accounts.length; i++) {
        if (accounts[i] == userInfoField) {
          let accountId = [userInfoField];
          //const accountToShareWith = await AccountRestInterface.getAccounts(accountId);
          //sequenceToBeShared.readAccess.push(accountToShareWith);
          emit('')
        }
      }
    }
    catch(e) {
      alert('Something went wrong');
    }
    }

}
</script>

<style scoped></style>
