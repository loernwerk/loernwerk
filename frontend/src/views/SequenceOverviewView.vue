<template>
  <div class="absolute top-0 bottom-0 left-0 right-0 flex flex-col">
    <PopupComponent>
      <TabbedContainer :tabs='tabNames'>
        <template v-slot:[0]="{ item }" >
          <TagSequencePopupTab/>
        </template>
        <template v-slot:[1]="{ item }" >
          <DeleteSequencePopup/>
        </template>
        <template v-slot:[2]="{ item }" >
          <ShareSequencePopupTab/>
        </template>
        <template v-slot:[3]="{ item }" >
          <SequenceDataPopupTab/>
        </template>
      </TabbedContainer>
    </PopupComponent>
  <div class="w-full h-full pt-[60px]">
    <div class="h-[80px]">
      <!--navbar-->
    </div>
    <div class="absolute right-2.5 top-[96px]">
      <SearchBarComponent class="mb-2"></SearchBarComponent>
    </div>

    <div class="flex pt-5 w-full h-full" style="height: 90%">
      <div class="flex-1 mr-1 ml-2">
        <SequenceDisplayContainer
            :name="name"
            :sequences="sequences"
        >
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
import { ISequence } from '../../../model/sequence/ISequence';
import ButtonComponent from '../components/ButtonComponent.vue';
import PopupComponent from "../components/PopupComponent.vue";
import TabbedContainer from "../components/TabbedContainer.vue";
import TagSequencePopupTab from "../components/PopupTabs/TagSequencePopupTab.vue";
import DeleteSequencePopup from "../components/PopupTabs/DeleteSequencePopup.vue";
import ShareSequencePopupTab from "../components/PopupTabs/ShareSequencePopupTab.vue";
import SearchBarComponent from "../components/SearchBarComponent.vue";
import SequenceDataPopupTab from "../components/PopupTabs/SequenceDataPopupTab.vue";
const name = 'Meine Sequenzen:';
const name2 = 'Mit mir geteilte Sequenzen:';
let sequences, sharedSequences: ISequence[];

let originalUser: unknown;
const tabs = ['TagSequencePopupTab', 'DeleteSequencePopup','ShareSequencePopupTab','SequenceDataPopupTab']
const tabNames = ['Sequenz Taggen','Sequenz löschen','Sequenz mit Lehrkräften teilen','Sequenz mit Teilnehmern teilen']

// let items = [
//   {
//     id: '1',
//     name: 'Sequenz löschen',
//     component: ButtonComponent
//   },
//   {
//     id: '2',
//     name: 'Sequenz teilen',
//     component: ButtonComponent
//   },
//   {
//     id: '3',
//     name: 'Sequenz Taggen',
//     component: ButtonComponent
//   }
// ]
//mocking a user with two sequences, zero shared
try {
  originalUser = 'John Doe'; //await AccountRestInterface.getOwnAccount();
  sequences = [
    {
      name: 'my first sequence',
      creationDate: new Date(),
      modificationDate: new Date(),
      code: 'code',
      authorId: 'authorId',
      writeAccess: [1, 2],
      readAccess: [1, 2],
      slideCount: 3,
    },
    {
      name: 'my second sequence',
      creationDate: new Date(),
      modificationDate: new Date(),
      code: 'code',
      authorId: 'authorId',
      writeAccess: [1, 2],
      readAccess: [1, 2],
      slideCount: 3,
    },
  ]; //await SequenceRestInterface.getOwnSequences();
  sharedSequences = []; //await SequenceRestInterface.getSequencesSharedWithYou();
  console.log(originalUser);
} catch (e) {
  if (e instanceof LoernwerkError) {
    if (e.code === LoernwerkErrorCodes.UNAUTHORIZED) {
      router.push('LogIn');
    }
  }
}
</script>