<template>
  <div class="flex flex-col">
    <div v-for="user in accounts" :key="user.id">
      <div>
        <ContainerComponent>
          <ButtonComponent @click="clicked(user.id as number)">
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
    type: Object as PropType<Array<Partial<IUser>>>,
    required: true,
  },
});

const emit = defineEmits(['selected']);
/**
 * emits, when the user clicks on a user in the list
 * @param userId the userId of the user clicked on
 */
function clicked(userId: number): void {
  console.log('Pressed: ' + userId);
  emit('selected', userId);
}
</script>
