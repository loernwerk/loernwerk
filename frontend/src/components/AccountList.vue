<template>
  <div class="flex flex-col">
    <div class="p-0.5">
      <SearchBarComponent
        @input-changed="
          (newInput) => {
            filterText = newInput;
          }
        "
      />
    </div>
    <div class="">
      <div v-for="user in filteredAccountList" :key="user.id">
        <div class="p-0.5">
          <ButtonComponent @click="emit('selected', user.id)">
            {{ user.name }}
          </ButtonComponent>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, ref } from 'vue';
import { IUser } from '../../../model/user/IUser';
import ButtonComponent from './ButtonComponent.vue';
import SearchBarComponent from './SearchBarComponent.vue';

const props = defineProps({
  accounts: {
    type: Object as PropType<Partial<IUser>[]>,
    required: true,
  },
});

const emit = defineEmits([
  /**
   * emits, when the user clicks on a user in the list
   * @param userId the userId of the user clicked on
   */
  'selected',
]);

const filterText = ref('');
const filteredAccountList = computed(() => {
  return props.accounts?.filter((element) => {
    return element.name?.match(filterText.value.concat('.*'));
  });
});
</script>
