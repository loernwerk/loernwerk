<template>
  <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col">
    <div class="w-full h-full pt-[60px]">
      <div class="h-[80px]">
        <!-- TODO navbar-->
      </div>
      <div class="absolute right-2.5 top-[96px]">
        <SearchBarComponent class="mb-2"  @searchClicked="applySearch"></SearchBarComponent>
      </div>

      <div class="flex pt-5 w-full h-full" style="height: 90%">
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
  </div>
</template>

<script setup lang="ts">
import SequenceDisplayContainer from '../components/contentDisplay/SequenceDisplayContainer.vue';
import { router } from '../router';
import {
  LoernwerkError,
  LoernwerkErrorCodes,
} from '../../../backend/loernwerkError';
import TagSequencePopupTab from '../components/PopupTabs/TagSequencePopupTab.vue';
import DeleteSequencePopup from '../components/PopupTabs/DeleteSequencePopup.vue';
import ShareSequencePopupTab from '../components/PopupTabs/ShareSequencePopupTab.vue';
import SearchBarComponent from '../components/SearchBarComponent.vue';
import SequenceDataPopupTab from '../components/PopupTabs/SequenceDataPopupTab.vue';
import { ref } from "vue";
import {SequenceRestInterface} from "../restInterfaces/SequenceRestInterface";
import {AccountRestInterface} from "../restInterfaces/AccountRestInterface";

const name = 'Meine Sequenzen:';
const name2 = 'Mit mir geteilte Sequenzen:';

const tabs = [
  'TagSequencePopupTab',
  'DeleteSequencePopup',
  'ShareSequencePopupTab',
  'SequenceDataPopupTab',
];

let sequences = ref({});
let allOwnSequences = ref({});
let sharedSequences = ref({});
let allSharedSequences = ref({});
let currentUser = ref({});

try {
  AccountRestInterface.getOwnAccount().then(data => {
    currentUser.value = data;
  });

    SequenceRestInterface.getSequencesSharedWithYou().then(data => {
      sharedSequences.value = data.slice(0);
      allSharedSequences.value = data.slice(0);
    })

  SequenceRestInterface.getOwnSequences().then(data => {
    sequences.value = data.slice(0);
    allOwnSequences.value = data.slice(0);
  });
} catch(e) {
  if (e instanceof LoernwerkError) {
        if (e.code === LoernwerkErrorCodes.UNAUTHORIZED) {
          router.push('LogIn');
        }
      }
}

function applySearch(searchText) {
  if (searchText.length === 0) {
    sequences.value = allOwnSequences.value.slice(0);
    sharedSequences.value = allSharedSequences.value.slice(0);
  } else {
    sequences.value = sequences.value.filter(s => s.name === searchText);
    sharedSequences.value = sharedSequences.value.filter(s => s.name === searchText);
  }
}
</script>
