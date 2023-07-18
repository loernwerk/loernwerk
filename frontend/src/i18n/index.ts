import { createI18n } from 'vue-i18n';

const messages = {
  de: {
    message: {
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
    },
  },
  en: {
    message: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
    },
  },
};

export const i18n = createI18n({
  locale: 'de',
  fallbackLocale: 'de',
  messages,
});
