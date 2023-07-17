<template>
  <ContainerComponent>
    <h1>
      Geben Sie die ID der Lehrkraft ein, mit der die Sequenz geteilt werden
      soll:
    </h1>
    <TextInputComponent
      class="my-2"
      v-model="userInfoField"
      :class="{ 'border-red-600': showRedBorder }"
    >
    </TextInputComponent>
    <div class="flex flex-row">
      <ButtonComponent class="basis-1/2 mr-2" @click="confirmSharing()"
        >Teilen
      </ButtonComponent>
      <ButtonComponent class="basis-1/2" @click="closePopup()"
        >Abbruch
      </ButtonComponent>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ContainerComponent from '../ContainerComponent.vue';
import TextInputComponent from '../TextInputComponent.vue';
import { ref, toRaw, watch } from 'vue';
import useEventsBus from '../../eventBus';
import { AccountRestInterface } from '../../restInterfaces/AccountRestInterface';
import ButtonComponent from '../ButtonComponent.vue';
const { bus } = useEventsBus();
const { emit } = useEventsBus();

let userInfoField = ref('');
let sequenceToBeShared;
let accounts;
let showRedBorder = ref(false);

watch(
  () => bus.value.get('sequence'),
  (sequence) => {
    sequenceToBeShared = toRaw(sequence)[0];
  }
);

/**
 * Closes this Popup
 */
function closePopup(): void {
  emit('close');
}

/**
 * Process sharing of a sequences
 */
async function confirmSharing(): Promise<void> {
  if (userInfoField.value.length == 0) {
    emit('userInfoEmpty');
    showRedBorder.value = true;
  } else {
    try {
      accounts = await AccountRestInterface.getAccountMetaDataList();
      for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].id.toString() == userInfoField.value) {
          let accountId = accounts[i].id;
          const accountToShareWith = await AccountRestInterface.getAccounts(
            accountId
          );
          sequenceToBeShared.readAccess.push(
            Object.keys(accountToShareWith[0])
          );
          closePopup();
        }
      }
    } catch (e) {
      alert('Something went wrong');
    }
  }
}
</script>

<style scoped></style>
