<template>
  <div v-if="currentlyEditing !== null" class="absolute">
    <ContainerComponent class="fixed top-3 bottom-3 left-3 right-3 z-10">
      <H5PEditor
        :content-id="currentlyEditing"
        @closed="currentlyEditing = null"
      />
    </ContainerComponent>
  </div>

  <div class="flex flex-col w-full">
    <div class="underline text-xl">Erstellter H5P-Inhalt:</div>

    <ContainerComponent
      v-for="(content, idx) in contents"
      :key="idx"
      class="w-full h-fit"
    >
      <div class="flex flex-row space-x-5 h-fit">
        <h3 class="text-3xl">{{ content.title }}</h3>
        <div class="h-full pt-2">{{ content.mainLibrary }}</div>
        <div class="flex-grow pt-2">
          Verwendete Sequenzen: {{ content.usedSequences.join(', ') }}
        </div>
        <ButtonComponent>Löschen</ButtonComponent>
        <ButtonComponent @click="currentlyEditing = content.contentId"
          >Bearbeiten</ButtonComponent
        >
      </div>
    </ContainerComponent>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { H5PRestInterface } from '../restInterfaces/H5PRestInterface';
import ButtonComponent from '../components/ButtonComponent.vue';
import ContainerComponent from '../components/ContainerComponent.vue';
import H5PEditor from '../components/contentDisplay/H5PEditor.vue';

const contents = ref(await H5PRestInterface.getH5PContentList());

const currentlyEditing: Ref<string | null> = ref(null);
</script>
