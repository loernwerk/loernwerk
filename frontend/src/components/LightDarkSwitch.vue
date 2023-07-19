<template>
  <input type="checkbox" v-model="value" />
</template>

<script setup lang="ts">
import { inject, provide, ref, watch } from 'vue';

const value = ref(inject<boolean>('isDarkMode') ?? false);

watch(value, (newValue) => {
  provide('isDarkMode', newValue);
});
</script>
