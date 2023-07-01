<template>
  <div class="h-full">
    <h5p-player
      ref="player"
      :content-id="h5pContent.h5pContentId"
      class="h-full w-full"
    />
  </div>
</template>

<script setup lang="ts">
import {
  defineElements,
  H5PPlayerComponent,
} from '@lumieducation/h5p-webcomponents';
import { H5PContent } from '../../../../model/slide/content/H5pContent';
import { PropType, Ref, onMounted, ref } from 'vue';
import { IPlayerModel } from '@lumieducation/h5p-server';

defineProps({
  /**
   * The h5p content to display
   */
  h5pContent: {
    type: Object as PropType<H5PContent>,
    required: true,
  },
});

defineElements('h5p-player');
const player: Ref<H5PPlayerComponent | null> = ref(null);

onMounted(() => {
  const h5pPlayer = player.value;
  if (h5pPlayer !== null) {
    h5pPlayer.loadContentCallback = async (
      contentId: string
    ): Promise<IPlayerModel> => {
      // TODO
      throw new Error('Error getting content with id: ' + contentId);
    };
  }
});

window.addEventListener('resize', () => {
  const h5pPlayer = player.value;
  if (h5pPlayer !== null) {
    h5pPlayer.resize();
  }
});
</script>
