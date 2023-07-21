<template>
  <div class="overflow-scroll">
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
import { H5PRestInterface } from '../../restInterfaces/H5PRestInterface';

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
      return await H5PRestInterface.getH5PContentForExecution(contentId);
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
