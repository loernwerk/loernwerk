<!-- Visualizes a content object. -->
<template>
  <div class="h-full p-3 relative">
    <div class="h-full" v-if="content">
      <EmbedDisplay
        v-if="content.type === ContentType.EMBED"
        :embed-content="(content as EmbedContent)"
        :edit-mode="editMode"
        class="h-full"
        @editing="(val) => $emit('editing', val)"
      />
      <TextDisplay
        v-else-if="content.type === ContentType.TEXT"
        :text-content="(content as TextContent)"
        :edit-mode="editMode"
        class="h-full"
        @editing="(val) => $emit('editing', val)"
      />
      <ImageDisplay
        v-else-if="content.type === ContentType.IMAGE"
        :image-content="(content as ImageContent)"
        :edit-mode="editMode"
        class="h-full"
        @editing="(val) => $emit('editing', val)"
      />
      <H5PDisplay
        v-else-if="content.type === ContentType.H5P"
        :h5p-content="(content as H5PContent)"
        :edit-mode="editMode"
        class="h-full"
        @editing="(val) => $emit('editing', val)"
      />
    </div>
    <div
      class="absolute flex flex-rows space-x-2 top-3 right-3"
      v-if="editMode"
    >
      <img
        v-for="[content, image] in possibleNewContentTypes"
        :key="content"
        class="h-3 cursor-pointer"
        :src="`/src/assets/icons/${image}`"
        @click="$emit('changeContent', content)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { Content, ContentType } from '../../../../model/slide/content/Content';
import EmbedDisplay from './EmbedDisplay.vue';
import { EmbedContent } from '../../../../model/slide/content/EmbedContent';
import { ImageContent } from '../../../../model/slide/content/ImageContent';
import ImageDisplay from './ImageDisplay.vue';
import TextDisplay from './TextDisplay.vue';
import { TextContent } from '../../../../model/slide/content/TextContent';
import H5PDisplay from './H5PDisplay.vue';
import { H5PContent } from '../../../../model/slide/content/H5PContent';

const props = defineProps({
  /**
   * The content to display
   */
  content: {
    type: Object as PropType<Content>,
    required: false,
  },

  /**
   * Indicates whether student or teacher is viewing the slide
   */
  editMode: {
    type: Boolean,
    required: true,
    default: false,
  },
});

defineEmits(['editing', 'changeContent']);

const possibleNewContentTypes = computed(() => {
  const contentTypes = [
    ContentType.TEXT,
    ContentType.IMAGE,
    ContentType.H5P,
    ContentType.EMBED,
  ];
  if (props.content) {
    contentTypes.splice(contentTypes.indexOf(props.content.type), 1);
  }

  const imageUrls: Record<ContentType, string> = {
    [ContentType.TEXT]: 'text.png',
    [ContentType.IMAGE]: 'image.png',
    [ContentType.H5P]: 'h5p.png',
    [ContentType.EMBED]: 'embed.png',
  };

  const returnValue: [ContentType, string][] = [];
  for (const c of contentTypes) {
    returnValue.push([c, imageUrls[c]]);
  }

  return returnValue;
});
</script>
