import { createI18n } from 'vue-i18n';

const messages = {
  de: {
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    notAvailable: '{object} nicht verfügbar',
    next: 'Weiter',
    slide: 'Seite',
    reloadPage: 'Bitte die Seite neu laden',
    account: {
      login: 'Anmelden',
      name: 'Benutzername',
      mail: 'E-Mail',
      password: 'Passwort',
      passwordRepeat: 'Passwort wiederholen',
      keepLoggedIn: 'Angemeldet bleiben',
      wrongLoginData: 'Falscher Benutzername/E-Mail oder Passwort',
    },
    finished: {
      youDidIt: 'Du hast es geschafft',
      done: 'und die Lernsequenz {name} erfolgreich abgeschlossen!',
      certificate: 'Teilnahmezertifikat',
    },
    main: {
      enterCode: 'Code eingeben',
      imprint: 'Impressum',
    },
  },
  en: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    notAvailable: '{object} not available',
    next: 'Next',
    slide: 'Slide',
    reloadPage: 'Please reload the page',
    account: {
      login: 'Login',
      name: 'Username',
      mail: 'E-Mail',
      password: 'Password',
      passwordRepeat: 'Repeat password',
      keepLoggedIn: 'Keep me logged in',
      wrongLoginData: 'Wrong username/E-Mail or password',
    },
    finished: {
      youDidIt: 'You did it',
      done: 'and successfully completed the learning sequence {name}!',
      certificate: 'Certificate of participation',
    },
    main: {
      enterCode: 'Enter code',
      imprint: 'Imprint',
    },
  },
};

export const i18n = createI18n({
  locale: 'de',
  fallbackLocale: 'de',
  messages,
});
