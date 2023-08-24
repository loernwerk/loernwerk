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
 * Checks whether an inputted URL is valid with or without an additional https:// prefix.
 * Uses the inbuilt URL constructor.
 *
 * @param url Url to check
 * @returns The valid url as a string, if it's valid, or false otherwise
 */
function isValidUrl(url: string): string | false {
  // trying the url without prefix
  try {
    new URL(url);
    return url;
  } catch {
    // do nothing
  }

  // trying the url with https prefix
  try {
    new URL(`https://${url}`);
    return `https://${url}`;
  } catch {
    // do nothing
  }

  return false;
}

/**
 * Updates the content
 * @param url The new url
 */
watch(url, () => {
  const validUrl = isValidUrl(url.value);
  if (validUrl !== false) {
    content.value.url = validUrl;
    emits('update-content', content.value);
  }
});

watch(
  () => props.embedContent,
  () => {
    content.value = props.embedContent;
    url.value = content.value.url;
  }
);
</script>
