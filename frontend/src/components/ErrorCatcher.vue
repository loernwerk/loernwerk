<template>
  <slot></slot>
</template>
<script setup lang="ts">
import { onErrorCaptured } from 'vue';

onErrorCaptured((err, instance, info) => {
  void instance;
  console.log('this needed to be displayed, err:' + err + ' info: ' + info);
  return false;
});
</script>
