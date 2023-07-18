<template>
  <div class="flex flex-row items-center space-x-2 w-full pt-5">
    <p>Link:</p>
    <TextInputComponent
      class="grow"
      :start-text="embedContent.url"
      v-model:model-value="url"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import { EmbedContent } from '../../../../model/slide/content/EmbedContent';
import TextInputComponent from '../TextInputComponent.vue';

const props = defineProps({
  /**
   * The embed content to edit
   */
  embedContent: {
    type: Object as PropType<EmbedContent>,
    required: true,
  },
});

const content = ref(props.embedContent);

const emits = defineEmits([
  /**
   * Emitted when the content has been edited
   *
   * @param content the updated content
   */
  'update-content',
]);

const url = ref(content.value.url);

/**
 * Updates the content
 * @param url The new url
 */
watch(url, () => {
  content.value.url = url.value;
  emits('update-content', content.value);
});

watch(
  () => props.embedContent,
  () => {
    content.value = props.embedContent;
    url.value = content.value.url;
  }
);
</script>
