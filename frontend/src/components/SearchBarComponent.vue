<template>
  <InteractableComponent>
    <div class="flex flex-row items-center space-x-2">
      <FontAwesomeIcon
        icon="search"
        class="text-gray-500"
        @click="$emit('search-clicked', searchText)"
      />
      <TextInputComponent
        class="flex-1 !border-none !bg-transparent"
        :placeHolder="placeHolder"
        @input-changed="
          (value) => {
            searchText = value;
            $emit('input-changed', value);
          }
        "
      />
    </div>
  </InteractableComponent>
</template>

<script setup lang="ts">
import InteractableComponent from './InteractableComponent.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import TextInputComponent from './TextInputComponent.vue';
import { ref } from 'vue';

library.add(faMagnifyingGlass);

defineProps({
  placeHolder: {
    type: String,
    required: false,
    default: 'Search...',
  },
});

defineEmits(['search-clicked', 'input-changed']);

const searchText = ref('');
</script>
