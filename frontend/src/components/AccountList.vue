<template>
  <div class="flex flex-col">
    <div>
      <SearchBarComponent
        @input-changed="
          (newInput) => {
            filterText = newInput;
            filter();
          }
        "
      />
    </div>
    <div v-for="user in accountArray" :key="user.id">
      <div>
        <ButtonComponent @click="emit('selected', user.id)">
          {{ user.name }}
        </ButtonComponent>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { IUser } from '../../../model/user/IUser';
import ButtonComponent from './ButtonComponent.vue';
import SearchBarComponent from './SearchBarComponent.vue';

const props = defineProps({
  accounts: {
    type: Object as PropType<Array<Partial<IUser>>>,
    required: true,
  },
});

const emit = defineEmits(['selected']);
/**
 * emits, when the user clicks on a user in the list
 * @param userId the userId of the user clicked on
 */

const accountArray = ref(props.accounts);
const filterText = ref('');

/**
 * filters the prop account array by the inputed text
 */
function filter(): void {
  accountArray.value = props.accounts.filter((element) => {
    return element.name?.match(filterText.value.concat('.*'));
  });
}
</script>
