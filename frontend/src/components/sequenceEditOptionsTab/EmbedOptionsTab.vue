<template>
  <div class="flex flex-row items-center space-x-2 w-full pt-5">
    <p>Link:</p>
    <TextInputComponent
      class="grow"
      :start-text="embedContent.url"
      @input-changed="(text) => update(text)"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { EmbedContent } from '../../../../model/slide/content/EmbedContent';
import TextInputComponent from '../TextInputComponent.vue';

const props = defineProps({
  embedContent: {
    type: Object as PropType<EmbedContent>,
    required: true,
  },
});

const content = ref(props.embedContent);

const emits = defineEmits(['update-content']);

/**
 * Updates the content
 * @param url The new url
 */
function update(url: string): void {
  content.value.url = url;
  emits('update-content', content.value);
}
</script>
