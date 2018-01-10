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
      weekday_other: "Reserve"
    },
    true,
    true
  );

export default i18n;
