import i18next from "i18next";
import enTranslation from "@/locales/en.json";
import { initReactI18next } from "react-i18next";

i18next.use(initReactI18next).init({
  debug: true,
  lng: "en",
  resources: {
    en: { translation: enTranslation },
    de: {},
  },
});
