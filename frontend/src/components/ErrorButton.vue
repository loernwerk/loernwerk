<template>
  <ButtonComponent @click="thrErr()"> throw Error </ButtonComponent>
</template>
<script setup lang="ts">
import ButtonComponent from './ButtonComponent.vue';

/**
 * throws error
 */
function thrErr(): void {
  throw new Error('test');
}
</script>
