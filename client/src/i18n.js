import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: "de",

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    interpolation: {
      escapeValue: false // not needed for react!!
    },

    react: {
      wait: true
    }
  })
  .addResourceBundle(
    "de",
    "translations",
    {
      weekday_0: "Mo",
      weekday_1: "Di",
      weekday_2: "Mi",
      weekday_3: "Do",
      weekday_4: "Fr",
      weekday_5: "Sa",
      weekday_6: "So",
      weekday_other: "Reserve",
      SC_TODO_ITEM: "Eintrag",
      SC_INCREMENT: "Erhöhen",
      SC_DECREMENT: "Verringern",
      SC_MOVE_UP: "Nach oben verschieben",
      SC_MOVE_DOWN: "Nach unten verschieben",
      SC_EDIT: "Bearbeiten",
      SC_EDIT_VIEW: "Bearbeitungs-Ansicht",
      SC_FOCUS_INPUT: "Neuer Eintrag",
      SC_PREVIOUS_LIST: "Vorherige Liste",
      SC_NEXT_LIST: "Nächste Liste",
      SC_SHOPPING_MODE: "Wechsel zu Einkaufs-Ansicht",
      SC_SHOPPING_VIEW: "Einkaufs-Ansicht",
      SC_EDIT_MODE: "Wechsel zu Bearbeitungs-Ansicht",
    },
    true,
    true
  );

export default i18n;
