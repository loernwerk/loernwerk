import { createI18n } from 'vue-i18n';

const messages = {
  de: {
    search: 'Suche',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    deleteObject: '{object} löschen',
    edit: 'Bearbeiten',
    view: 'Ansehen',
    notAvailable: '{object} nicht verfügbar',
    next: 'Weiter',
    back: 'Zurück',
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
    leaveWarning:
      'Wollen Sie die Seite wirklich verlassen? Ungespeicherte Änderungen gehen verloren!',
    account: {
      login: 'Anmelden',
      register: 'Registrieren',
      name: 'Benutzername',
      mail: 'E-Mail',
      password: 'Passwort',
      passwordRepeat: 'Passwort wiederholen',
      inviteCode: 'Einladungscode',
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
      fileTooLarge: 'Datei ist größer als 2 MB',
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
      tags: 'Schlüsselwörter',
      tagAddError: 'Fehler beim Hinzufügen der Schlüsselwörter',
      tagIntro: 'Schlüsselwörter der Sequenz (mit "," getrennt):',
      shareWithStudent: 'Mit Teilnehmenden teilen',
      shareWithTeacher: 'Mit Lehrkraft teilen',
      teacher: 'Lehrkraft',
      student: 'Teilnehmenden',
      shareEmptyWarning:
        'Sie versuchen, eine leere Sequenz zu teilen! Um eine Sequenz den Teilnehmenden zu teilen, erstelle bitte mind. eine Seite und speichere diese.',
    },
    config: {
      maxSequences: 'Maximale Anzahl an Lernsequenzen',
      maxSlides: 'Maximale Anzahl an Seiten',
      emptyPossible: 'Leer lassen für unbegrenzt',
      invalidInput: 'Ungültige Eingabe für {object}',
      registrationType: 'Registrierungsart',
      registrationCodes: 'Einladungscodes (getrennt durch Kommas)',
      registrationCodesExpirations:
        'Einladungscode verliert nach Verwendung Gültigkeit',
      open: 'Offene Registrierung',
      closed: 'Registrierung durch Admin',
      invite: 'Registrierung durch Einladungscodes',
      config: 'Einstellungen',
      autodeleteUnusedH5P:
        'Ungenutze H5P-Inhalte bei Sequenz-Bearbeitung oder -Löschung automatisch löschen',
    },
    navBar: {
      overview: 'Sequenzübersicht',
      admin: 'Admin',
      sequenceEdit: 'Sequenzbearbeitung',
      h5pOverview: 'H5P-Inhalte',
    },
    h5p: {
      clickToEdit: 'Klicke um den Inhalt zu bearbeiten',
      createNewContent: 'Neuen H5P-Inhalt erstellen',
      usedBy: 'verwendet von {object} Sequenzen',
      overviewTitle: 'Erstellter H5P-Inhalt',
      usedSequences: 'Verwendete Sequenzen',
    },
    looseContentWarning: 'Dies löscht den vorherigen Inhalt des Feldes',
  },
  en: {
    search: 'Search',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    deleteObject: 'Delete {object}',
    edit: 'Edit',
    view: 'View',
    notAvailable: '{object} not available',
    next: 'Next',
    back: 'Back',
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
    leaveWarning:
      'Do you want to leave the site? Unsaved changes will be lost!',
    account: {
      login: 'Login',
      register: 'Register',
      name: 'Username',
      mail: 'E-Mail',
      password: 'Password',
      passwordRepeat: 'Repeat password',
      inviteCode: 'Invite Code',
      keepLoggedIn: 'Stay logged in',
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
      fileTooLarge: 'File is larger than MB',
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
      tags: 'Tags',
      tagAddError: 'Error while adding tags',
      tagIntro: 'Tags of sequence (separated by ","):',
      shareWithStudent: 'Share with students',
      shareWithTeacher: 'Share with teacher',
      teacher: 'Teacher',
      student: 'Students',
      shareEmptyWarning:
        'You are trying to share an empty sequence! To share a sequence with students, please create at least one slide and save it.',
    },
    config: {
      maxSequences: 'Maximum number of learning sequences',
      maxSlides: 'Maximum number of slides',
      emptyPossible: 'Leave empty for unlimited',
      invalidInput: 'Invalid input for {object}',
      registrationType: 'Registrationtype',
      registrationCodes: 'Registrationcodes (seperated by comma)',
      registrationCodesExpirations: 'Registrationcode expires after use',
      open: 'Open registration',
      closed: 'Only admins can add new users',
      invite: 'Registration through invitecodes',
      config: 'Settings',
      autodeleteUnusedH5P:
        'Delete unused H5P contents upon saving or deleting a sequence',
    },
    navBar: {
      overview: 'Sequenceoverview',
      admin: 'Admin',
      sequenceEdit: 'Edit sequence',
      h5pOverview: 'H5P contents',
    },
    h5p: {
      clickToEdit: 'Click to edit the content',
      createNewContent: 'Create new H5P-Content',
      usedBy: 'used by {object} sequences',
      overviewTitle: 'Created H5P-Content',
      usedSequences: 'Used Sequences',
    },
    looseContentWarning: 'This will delete the previous content of the field',
  },
};

export const i18n = createI18n({
  locale: 'de',
  fallbackLocale: 'de',
  messages,
});
