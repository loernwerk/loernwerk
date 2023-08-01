<template>
  <ul>
    <li v-for="(content, idx) in contents" :key="idx">
      {{ content.title }} - {{ content.contentId }} -
      {{ content.mainLibrary }} - {{ content.usedSequences.join(',') }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { H5PRestInterface } from '../restInterfaces/H5PRestInterface';

const contents = ref(await H5PRestInterface.getH5PContentList());
</script>
