import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";

import deLang from "./translations/de";
import enLang from "./translations/en";

const i18nInstance = i18n
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: "en",

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    interpolation: {
      escapeValue: false // not needed for react!!
    },

    react: {
      wait: true
    }
  });

i18nInstance.addResourceBundle("en", "translations", enLang, true, true);
i18nInstance.addResourceBundle("de", "translations", deLang, true, true);

export default i18n;
