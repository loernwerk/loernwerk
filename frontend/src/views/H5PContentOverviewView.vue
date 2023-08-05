<template>
  <div v-if="currentlyEditing !== null" class="absolute">
    <ContainerComponent class="fixed top-3 bottom-3 left-3 right-3 z-10">
      <H5PEditor :content-id="currentlyEditing" @closed="finishEditing()" />
    </ContainerComponent>
  </div>

  <div class="flex flex-col w-full">
    <div class="flex flex-row w-full mb-5 justify-between">
      <div class="underline text-xl">{{ $t('h5p.overviewTitle') }}:</div>

      <InteractableComponent v-if="isAdmin">
        <select v-model="selectedUser" class="w-full">
          <option v-for="user of allUsers" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
      </InteractableComponent>
    </div>

    <ContainerComponent
      v-for="(content, idx) in contents"
      :key="idx"
      class="w-full h-fit"
    >
      <div class="flex flex-row space-x-5 h-fit">
        <h3 class="text-3xl">{{ content.title }}</h3>
        <div class="h-full pt-2">{{ content.mainLibrary }}</div>
        <div class="flex-grow pt-2">
          <span v-if="content.usedSequences.length > 0">
            {{ $t('h5p.usedSequences') }}:
            {{ content.usedSequences.join(', ') }}
          </span>
        </div>
        <ButtonComponent
          v-if="content.usedSequences.length === 0"
          @click="deleteContent(content.contentId)"
          >{{ $t('delete') }}</ButtonComponent
        >
        <ButtonComponent @click="editContent(content.contentId)">{{
          $t('edit')
        }}</ButtonComponent>
      </div>
    </ContainerComponent>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import { H5PRestInterface } from '../restInterfaces/H5PRestInterface';
import ButtonComponent from '../components/ButtonComponent.vue';
import ContainerComponent from '../components/ContainerComponent.vue';
import InteractableComponent from '../components/InteractableComponent.vue';
import H5PEditor from '../components/contentDisplay/H5PEditor.vue';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';
import { IUser, UserClass } from '../../../model/user/IUser';

const contents = ref(await H5PRestInterface.getH5PContentList());
const currentlyEditing: Ref<string | null> = ref(null);
const selectedUser: Ref<number | null> = ref(null);
const isAdmin = ref(false);
const allUsers: Ref<Partial<IUser>[]> = ref([]);

const user = await AccountRestInterface.getOwnAccount();
if (user.type === UserClass.ADMIN) {
  allUsers.value = await AccountRestInterface.getAccountMetaDataList();
  selectedUser.value = user.id as number;
  isAdmin.value = true;
}

/**
 * Updates the list of contents for the active user.
 */
async function updateList(): Promise<void> {
  if (selectedUser.value === null) {
    contents.value = await H5PRestInterface.getH5PContentList();
  } else {
    contents.value = await H5PRestInterface.getH5PContentList(
      selectedUser.value
    );
  }
}

/**
 * Opens supplied H5P content in the integrated editor.
 * @param contentId H5P content to open
 */
function editContent(contentId: string): void {
  currentlyEditing.value = contentId;
}

/**
 * Closes the H5P editor and updates the list.
 */
async function finishEditing(): Promise<void> {
  currentlyEditing.value = null;
  await updateList();
}

/**
 * Deletes H5P content.
 * @param contentId Id of the content to delete
 */
async function deleteContent(contentId: string): Promise<void> {
  await H5PRestInterface.deleteH5PContent(contentId);
  await updateList();
}

watch(selectedUser, async () => {
  await updateList();
});
</script>
