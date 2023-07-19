<template>
  <ContainerComponent class="w-1/4 flex flex-col">
    <template #Header>
      <div class="flex flex-col p-0.5">
        <ButtonComponent @click="emit('createUser')" class="pb-1">
          Nutzer erstellen
        </ButtonComponent>
        <SearchBarComponent
          @input-changed="
            (newInput) => {
              filterText = newInput;
            }
          "
          class="p-0.5"
        />
      </div>
    </template>
    <template #default>
      <div class="flex flex-col">
        <div v-for="user in filteredAccountList" :key="user.id">
          <div class="p-0.5">
            <ButtonComponent @click="emit('selected', user.id)">
              {{ user.name }}
            </ButtonComponent>
          </div>
        </div>
      </div>
    </template>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { IUser } from '../../../../model/user/IUser';
import ButtonComponent from '../ButtonComponent.vue';
import SearchBarComponent from '../SearchBarComponent.vue';
import ContainerComponent from '../ContainerComponent.vue';

const props = defineProps({
  accounts: {
    type: Array<Partial<IUser>>,
    required: true,
  },
});

const emit = defineEmits([
  /**
   * emits, when the user clicks on a user in the list
   * @param userId the userId of the user clicked on
   */
  'selected',
  'createUser',
]);

const filterText = ref('');
const filteredAccountList = computed(() => {
  return props.accounts?.filter((element) => {
    return element.name?.includes(filterText.value);
  });
});
</script>
