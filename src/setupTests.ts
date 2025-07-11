import "@testing-library/jest-dom";
import { GlobalWithTauri, TranslationParams } from "./types";

(global as unknown as GlobalWithTauri).window = {
  ...(global as unknown as GlobalWithTauri).window,
  __TAURI__: {
    tauri: {
      invoke: jest.fn(),
    },
  },
};

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, params?: TranslationParams) => {
      if (params) {
        return key.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
          const value = params[paramKey];
          return value !== undefined ? String(value) : match;
        });
      }
      return key;
    },
    i18n: {
      changeLanguage: jest.fn(),
      language: "en",
    },
  }),
  initReactI18next: {
    type: "3rdParty",
    init: jest.fn(),
  },
}));

jest.mock("xlsx", () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn(),
  },
}));
