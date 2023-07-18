<!-- View to overview and edit own sequences and shared sequences -->
<template>
  <PopupNewSequence
    v-if="showPopupNewSequence"
    @closed="showPopupNewSequence = false"
  >
  </PopupNewSequence>

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
        <SequenceDisplayContainer
          name="Meine Sequenzen:"
          :sequences="sequences"
          @reload-sequences="reloadSequences()"
        >
        </SequenceDisplayContainer>
      </div>
      <div class="flex-1 ml-1 mr-2">
        <SequenceDisplayContainer
          name="Mit mir geteilte Sequenzen:"
          :sequences="sharedSequences"
          :show-restricted-menu="true"
        ></SequenceDisplayContainer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { SequenceRestInterface } from '../restInterfaces/SequenceRestInterface';
import SearchBarComponent from '../components/SearchBarComponent.vue';
import ButtonComponent from '../components/ButtonComponent.vue';
import PopupNewSequence from '../components/PopupNewSequence.vue';
import SequenceDisplayContainer from '../components/SequenceDisplayContainer.vue';
import { ISequence } from '../../../model/sequence/ISequence';

const showPopupNewSequence = ref(false);

const sequences: Ref<ISequence[]> = ref([]);
const allOwnSequences: Ref<ISequence[]> = ref([]);
const sharedSequences: Ref<ISequence[]> = ref([]);
const allSharedSequences: Ref<ISequence[]> = ref([]);

await reloadSequences();

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

/**
 * Reloads sequences in overview
 */
async function reloadSequences(): Promise<void> {
  try {
    SequenceRestInterface.getSequencesSharedWithYou().then((data) => {
      sharedSequences.value = data.slice(0);
      allSharedSequences.value = data.slice(0);
    });

    SequenceRestInterface.getOwnSequences().then((data) => {
      sequences.value = data.slice(0);
      allOwnSequences.value = data.slice(0);
    });
  } catch {
    //TODO: error handling
  }
}
</script>
