<template>
  <div>
    <h5p-player ref="player" :content-id="contentId" class="h-full w-full" />
  </div>
</template>

<script setup lang="ts">
import {
  defineElements,
  H5PPlayerComponent,
} from '@lumieducation/h5p-webcomponents';
import { Ref, onMounted, ref } from 'vue';
import { IPlayerModel } from '@lumieducation/h5p-server';

defineProps({
  /**
   * The h5p content to display
   */
  contentId: {
    type: String,
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
