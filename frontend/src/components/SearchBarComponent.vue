<!-- Interactive search bar -->
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
        :placeHolder="
          placeHolder !== undefined ? placeHolder : `${$t('search')}...`
        "
        v-model="searchText"
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
import { ref, watch } from 'vue';

library.add(faMagnifyingGlass);

defineProps({
  /**
   * The placeholder text for the search bar
   */
  placeHolder: {
    type: String,
    required: false,
  },
});

const emit = defineEmits([
  /**
   * Event for when the search button is clicked
   *
   * @param searchText The text in the search bar
   */
  'search-clicked',
  /**
   * Event for when the text in the search bar changes
   *
   * @param searchText The text in the search bar
   */
  'input-changed',
]);

const searchText = ref('');

watch(searchText, (newSearch) => {
  emit('input-changed', newSearch);
});
</script>
