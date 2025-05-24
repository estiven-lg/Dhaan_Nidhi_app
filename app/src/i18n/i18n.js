import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';

// 1. Detectar idioma del dispositivo

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: { translation: en },
      hi: { translation: hi },
    },
    fallbackLng: 'hi',
    interpolation: {
      escapeValue: true, // react ya se encarga
    },
  })

export default i18n;