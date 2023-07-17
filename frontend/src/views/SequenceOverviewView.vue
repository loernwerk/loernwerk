<!-- View to overview and edit own sequences and shared sequences -->
<template>
  <PopupNewSequence v-if="showPopupNewSequence"> </PopupNewSequence>

  <div class="w-full h-full">
    <div class="flex items-center h-fit">
      <ButtonComponent
        class="px-4 w-fit h-full"
        @click="showPopupNewSequence = true"
      >
        Sequenz erstellen
      </ButtonComponent>
      <SearchBarComponent @searchClicked="(val: string) => applySearch(val)" />
    </div>

    <div class="flex pt-5 w-full h-full">
      <div class="flex-1 mr-1 ml-2">
        <SequenceDisplayContainer :name="name" :sequences="sequences">
        </SequenceDisplayContainer>
      </div>
      <div class="flex-1 ml-1 mr-2">
        <SequenceDisplayContainer
          :name="name2"
          :sequences="sharedSequences"
          userId="originalUser"
        ></SequenceDisplayContainer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { router } from '../router';
import { ref } from 'vue';
import { SequenceRestInterface } from '../restInterfaces/SequenceRestInterface';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';
import SearchBarComponent from '../components/SearchBarComponent.vue';
import ButtonComponent from '../components/ButtonComponent.vue';
import PopupNewSequence from '../components/PopupNewSequence.vue';
import SequenceDisplayContainer from '../components/contentDisplay/SequenceDisplayContainer.vue';
import {
  LoernwerkError,
  LoernwerkErrorCodes,
} from '../../../model/loernwerkError';

const name = 'Meine Sequenzen:';
const name2 = 'Mit mir geteilte Sequenzen:';
const showPopupNewSequence = ref(false);

const sequences = ref([]);
let allOwnSequences = ref({});
let sharedSequences = ref({});
let allSharedSequences = ref({});
let currentUser = ref({});

try {
  AccountRestInterface.getOwnAccount().then((data) => {
    currentUser.value = data;
  });

  SequenceRestInterface.getSequencesSharedWithYou().then((data) => {
    sharedSequences.value = data.slice(0);
    allSharedSequences.value = data.slice(0);
  });

  SequenceRestInterface.getOwnSequences().then((data) => {
    sequences.value = data.slice(0);
    allOwnSequences.value = data.slice(0);
  });
} catch (e) {
  if (e instanceof LoernwerkError) {
    if (e.code === LoernwerkErrorCodes.UNAUTHORIZED) {
      router.push('LogIn');
    }
  }
}

/**
 * Searches a sequence with given name
 * @param searchText given name of the sequence which is searched
 */
function applySearch(searchText: string): void {
  if (searchText.length === 0) {
    sequences.value = allOwnSequences.value.slice(0);
    sharedSequences.value = allSharedSequences.value.slice(0);
  } else {
    sequences.value = sequences.value.filter((s) => s.name === searchText);
    sharedSequences.value = sharedSequences.value.filter(
      (s) => s.name === searchText
    );
  }
}
</script>
