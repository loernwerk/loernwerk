import { createI18n } from 'vue-i18n';

const messages = {
  de: {},
  en: {},
};

export const i18n = createI18n({
  locale: 'de',
  fallbackLocale: 'de',
  messages,
});
