import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { en } from "./locales/en";
import { sv } from "./locales/sv";
import { ar } from "./locales/ar";

const resources = {
	en: {
		translation: en
	},
	sv: {
		translation: sv
	},
	ar: {
		translation: ar
	}
};

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "sv",
		debug: false,

		interpolation: {
			escapeValue: false
		},

		detection: {
			order: ["localStorage", "navigator", "htmlTag"],
			caches: ["localStorage"]
		}
	});

export default i18n;
