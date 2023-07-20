<template>
  <div class="flex space-x-2 items-center">
    <img
      v-for="lang in i18n.global.availableLocales"
      :key="lang"
      :src="getIconUrl(lang as string)"
      @click="changeLanguage(lang)"
      class="border-1 rounded-full cursor-pointer h-8 w-8 box-border"
      :class="{ 'border-2': i18n.global.locale === lang }"
      :style="{ borderColor: borderColor }"
    />
  </div>
</template>

<script setup lang="ts">
import { i18n } from '../../i18n';

defineProps({
  borderColor: {
    type: String,
    required: false,
    default: 'white',
  },
});

/**
 * Gets the icon for a language
 * @param lang Langueage to get the icon for
 * @returns The icon url
 */
function getIconUrl(lang: string): string {
  return new URL(`../../assets/langs/${lang}.png`, import.meta.url).href;
}

/**
 * Changes the language
 * @param lang The new language
 */
function changeLanguage(lang: 'de' | 'en'): void {
  i18n.global.locale = lang;
}
</script>
