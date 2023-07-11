<template>
  <div class="flex flex-col">
    <div v-for="(user, index) in accounts" :key="index">
      <div>
        <ContainerComponent>
          <ButtonComponent @click="clicked(user)">
            {{ user.name }}
          </ButtonComponent>
        </ContainerComponent>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { IUser } from '../../../model/user/IUser';
import ButtonComponent from './ButtonComponent.vue';
import ContainerComponent from './ContainerComponent.vue';

defineProps({
  accounts: {
    type: Object as PropType<Partial<IUser>[]>,
    required: true,
  },
});

const emit = defineEmits(['selected']);
/**
 * emits, when the user clicks on a user in the list
 * @param user the user clicked on
 */
function clicked(user: Partial<IUser>): void {
  emit('selected', user);
}
</script>
