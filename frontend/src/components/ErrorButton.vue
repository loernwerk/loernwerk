<template>
  <ButtonComponent @click="thrErr()"> throw Error </ButtonComponent>
</template>
<script setup lang="ts">
import ButtonComponent from './ButtonComponent.vue';

let index = 0;

/**
 * throws error
 */
function thrErr(): void {
  throw new Error('test' + index++);
}
</script>
