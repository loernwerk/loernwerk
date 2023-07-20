import { createI18n } from 'vue-i18n';

const messages = {
  de: {
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    deleteObject: '{object} löschen',
    edit: 'Bearbeiten',
    view: 'Ansehen',
    notAvailable: '{object} nicht verfügbar',
    next: 'Weiter',
    slide: 'Seite',
    reloadPage: 'Bitte die Seite neu laden',
    create: '{object} erstellen',
    createAction: 'Erstellen',
    created: '{object} erstellt',
    user: 'Benutzer',
    invalidInput: 'Ungültige Eingabe',
    change: '{object} ändern',
    saved: '{object} gespeichert',
    deleted: '{object} gelöscht',
    show: 'Anzeigen',
    failed: '{object} fehlgeschlagen',
    account: {
      login: 'Anmelden',
      name: 'Benutzername',
      mail: 'E-Mail',
      password: 'Passwort',
      passwordRepeat: 'Passwort wiederholen',
      keepLoggedIn: 'Angemeldet bleiben',
      wrongLoginData: 'Falscher Benutzername/E-Mail oder Passwort',
      isAdmin: 'Administrator',
      sequencesOfUser: 'Lernsequenzen vom Benutzer',
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
    content: {
      image: 'Bild',
      scale: 'Skalierung',
      sequenceName: 'Name der Lernsequenz',
      background: 'Hintergrund',
      layout: 'Anordnung',
      fileTooLarge: 'Datei ist größer als {size}',
      fileNotFound: 'Datei nicht gefunden',
      text: 'Text',
      embed: 'Einbetten',
    },
    sequence: {
      sequence: 'Lernsequenz',
      mySequences: 'Meine Lernsequenzen',
      sharedSequences: 'Mit mir geteilte Lernsequenzen',
      creationError: 'Fehler beim Erstellen der Lernsequenz',
      name: 'Name der Sequenz',
      readAccess: 'Leserechte',
      writeAccess: 'Schreibrechte',
      codeOf: 'Code der Sequenz',
      linkOf: 'Link der Sequenz',
      deleteError: 'Fehler beim Löschen der Lernsequenz',
      share: 'Teilen',
      teacherWith: 'Lehrkraft mit {object}',
      shareError: 'Fehler beim Teilen der Lernsequenz',
      teacherName: 'Name der Lehrkraft',
      tag: 'Schlüsselwort | Schlüsselwörter',
      tagAddError: 'Fehler beim Hinzufügen der Schlüsselwörter',
      tagIntro: 'Schlüsselwörter der Sequenz (mit "," getrennt):',
      shareWith: 'Mit {object} teilen',
      teacher: 'Lehrkraft',
      student: 'Teilnehmenden',
    },
    config: {
      maxSequences: 'Maximale Anzahl an Lernsequenzen',
      maxSlides: 'Maximale Anzahl an Seiten',
      emptyPossible: 'Leer lassen für unbegrenzt',
      invalidInput: 'Ungültige Eingabe für {object}',
    },
    navBar: {
      overview: 'Sequenzübersicht',
      admin: 'Admin',
      sequenceEdit: 'Sequenzbearbeitung',
    },
  },
  en: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    deleteObject: 'Delete {object}',
    edit: 'Edit',
    view: 'View',
    notAvailable: '{object} not available',
    next: 'Next',
    slide: 'Slide | Slides',
    reloadPage: 'Please reload the page',
    create: 'Create {object}',
    createAction: 'Create',
    created: '{object} created',
    user: 'User',
    invalidInput: 'Invalid input',
    change: 'Change {object}',
    saved: '{object} saved',
    deleted: '{object} deleted',
    show: 'Show',
    failed: '{object} failed',
    account: {
      login: 'Login',
      name: 'Username',
      mail: 'E-Mail',
      password: 'Password',
      passwordRepeat: 'Repeat password',
      keepLoggedIn: 'Keep me logged in',
      wrongLoginData: 'Wrong username/E-Mail or password',
      isAdmin: 'is admin',
      sequencesOfUser: 'Sequences of user',
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
    content: {
      image: 'Image',
      scale: 'Scale',
      sequenceName: 'Name of the learning sequence',
      background: 'Background',
      layout: 'Layout',
      fileTooLarge: 'File is larger than {size}',
      fileNotFound: 'File not found',
      text: 'Text',
      embed: 'Embed',
    },
    sequence: {
      sequence: 'Learning sequence',
      mySequences: 'My learning sequences',
      sharedSequences: 'Learning sequences shared with me',
      creationError: 'Error while creating learning sequence',
      name: 'Name of sequence',
      readAccess: 'Read access',
      writeAccess: 'Write access',
      codeOf: 'Code of sequence',
      linkOf: 'Link of sequence',
      deleteError: 'Error while deleting learning sequence',
      share: 'Share',
      teacherWith: 'Teacher with {object}',
      shareError: 'Error while sharing learning sequence',
      teacherName: 'Name of teacher',
      tag: 'Tag | Tags',
      tagAddError: 'Error while adding tags',
      tagIntro: 'Tags of sequence (separated by ","):',
      shareWith: 'Share with {object}',
      teacher: 'Teacher',
      student: 'Students',
    },
    config: {
      maxSequences: 'Maximum number of learning sequences',
      maxSlides: 'Maximum number of slides',
      emptyPossible: 'Leave empty for unlimited',
      invalidInput: 'Invalid input for {object}',
    },
    navBar: {
      overview: 'Sequenceoverview',
      admin: 'Admin',
      sequenceEdit: 'Edit sequence',
    },
  },
};

export const i18n = createI18n({
  locale: 'de',
  fallbackLocale: 'de',
  messages,
});
