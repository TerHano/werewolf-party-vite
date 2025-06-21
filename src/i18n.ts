import i18next from "i18next";
import enTranslation from "@/locales/en.json";
import esTranslation from "@/locales/es.json";
import { initReactI18next } from "react-i18next";

i18next.use(initReactI18next).init({
  debug: true,
  lng: "es",
  resources: {
    en: { translation: enTranslation },
    es: { translation: esTranslation },
  },
});
