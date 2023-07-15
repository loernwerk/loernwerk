<template>
  <div
    class="text-2xl select-none"
    :class="{ italic: active, 'font-bold': active }"
  >
    <router-link :to="targetLink" v-if="targetLink !== ''">
      <slot></slot>
    </router-link>
    <span v-else>
      <slot></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  targetLink: {
    type: String,
    required: false,
    default: '',
  },
  active: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>
