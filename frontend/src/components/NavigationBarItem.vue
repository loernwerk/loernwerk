<template>
  <div class="text-2xl select-none text-white" :class="{ 'font-bold': active }">
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
  /**
   * Link target of this menu item
   */
  targetLink: {
    type: String,
    required: false,
    default: '',
  },

  /**
   * Whether this menu item should be marked as the active one
   */
  active: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>
