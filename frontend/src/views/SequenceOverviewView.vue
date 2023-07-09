<template>
  <div class="w-full h-full">
    <div class="h-24.5 col-span-2 w-full -mt-28 -mb-20 flex flex-row">
      <div><img src="../assets/Logo.png" class="w-1/3 -ml-44 scale-50" /></div>
      <div><ButtonComponent class="-ml-6 -mb-40">Menü</ButtonComponent></div>
      <div>
        <font-awesome-icon
          :icon="['fas', 'circle-user']"
          size="2xl"
          style="color: #22511f"
          class="mr-12 -mb-40 scale-150"
          @click="router.push('LogIn')"
        />
      </div>
    </div>

    <div class="columns-2" style="height: 85%">
      <SequenceDisplayContainer
        :name="name"
        :sequences="sequences"
      ></SequenceDisplayContainer>
      <SequenceDisplayContainer
        :name="name2"
        :sequences="sharedSequences"
        userId="originalUser"
      ></SequenceDisplayContainer>
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import ButtonComponent from '../components/ButtonComponent.vue';

const name = 'Meine Sequenzen:';
const name2 = 'Mit mir geteilte Sequenzen:';
let sequences, sharedSequences: ISequence[];
library.add(faCircleUser);

let originalUser: unknown;

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