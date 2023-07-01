<template>
  <div class="h-full">
    <div class="absolute" v-if="openEditor">
      <H5PEditor
        :content-id="h5pContent.h5pContentId"
        @closed="openEditor = false"
      />
    </div>

    <div class="h-full cursor-pointer flex p-5" @click="openEditor = true">
      <div class="w-full flex flex-col justify-center items-center">
        <img src="../../assets/h5p.png" class="w-3/4" />
        <p class="text-center text-2xl mt-5">
          Klicke um den Inhalt zu bearbeiten
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { H5PContent } from '../../../../model/slide/content/H5pContent';
import H5PEditor from './H5PEditor.vue';

defineProps({
  /**
   * The h5p content to display
   */
  h5pContent: {
    type: Object as PropType<H5PContent>,
    required: true,
  },
});

const openEditor = ref(false);
</script>
