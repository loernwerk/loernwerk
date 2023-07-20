<!-- View to overview and edit own sequences and shared sequences -->
<template>
  <div class="w-full">
    <PopupNewSequence
      v-if="showPopupNewSequence"
      @closed="showPopupNewSequence = false"
    >
    </PopupNewSequence>

    <div class="w-full flex flex-col h-full overflow-hidden">
      <div class="h-fit flex space-x-5">
        <div class="flex items-center h-fit flex-1 space-x-2">
          <ButtonComponent
            class="w-fit"
            @click="showPopupNewSequence = true"
            v-if="allOwnSequences.length < maxSequnces || maxSequnces < 0"
          >
            Sequenz erstellen
          </ButtonComponent>
          <SearchBarComponent
            @input-changed="(val: string) => applySearch(val)"
            class="grow"
          />
        </div>
        <div class="flex-1"><!-- Empty div to fill remaining space --></div>
      </div>

      <div class="flex pt-5 w-full space-x-5 grow overflow-hidden">
        <SequenceDisplayContainer
          name="Meine Sequenzen:"
          :sequences="sequences"
          :user-id="ownId"
          @reload-sequences="reloadSequences()"
          class="flex-1 h-full max-h-full"
        />
        <SequenceDisplayContainer
          name="Mit mir geteilte Sequenzen:"
          :sequences="sharedSequences"
          :user-id="ownId"
          class="flex-1 h-full max-h-full"
        />
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
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';
import { ConfigRestInterface } from '../restInterfaces/ConfigRestInterface';
import { ConfigKey } from '../../../model/configuration/ConfigKey';

const showPopupNewSequence = ref(false);

const sequences: Ref<ISequence[]> = ref([]);
const allOwnSequences: Ref<ISequence[]> = ref([]);
const sharedSequences: Ref<ISequence[]> = ref([]);
const allSharedSequences: Ref<ISequence[]> = ref([]);

await reloadSequences();

const ownId = ref(-1);
const ownAccount = await AccountRestInterface.getOwnAccount();
if (ownAccount.id !== undefined) {
  ownId.value = ownAccount.id;
}

/**
 * Searches a sequence with given name
 * @param searchText given name of the sequence which is searched
 */
function applySearch(searchText: string): void {
  if (searchText.length === 0) {
    sequences.value = allOwnSequences.value;
    sharedSequences.value = allSharedSequences.value;
  } else {
    sequences.value = allOwnSequences.value.filter(
      (s) =>
        s.name.includes(searchText) ||
        s.tags.some((tag) => tag.includes(searchText))
    );
    sharedSequences.value = allSharedSequences.value.filter((s) =>
      s.name.includes(searchText)
    );
  }
}

/**
 * Reloads sequences in overview
 */
async function reloadSequences(): Promise<void> {
  sharedSequences.value =
    await SequenceRestInterface.getSequencesSharedWithYou();
  allSharedSequences.value = sharedSequences.value;

  sequences.value = await SequenceRestInterface.getOwnSequences();
  allOwnSequences.value = sequences.value;
}

const maxSequnces = ref(-1);
try {
  maxSequnces.value = (await ConfigRestInterface.getValue(
    ConfigKey.MAX_SEQUENCES_PER_USER
  )) as number;
} catch (e) {
  // allow unlimited sequences
}
</script>
