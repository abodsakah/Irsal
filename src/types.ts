export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  socialNumber?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  phone: string;
  notes?: string;
  addedDate: string;
}

export interface Campaign {
  id: string;
  title: string;
  message: string;
  scheduledDate?: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  sentCount: number;
  totalCount: number;
  createdDate: string;
}

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  isConfigured: boolean;
}

export interface TranslationParams {
  [key: string]: string | number;
}

export interface CSVRowData {
  FirstName?: string;
  LastName?: string;
  SocialNumber?: string;
  Address?: string;
  PostalCode?: string;
  City?: string;
  Mobile?: string;
  [key: string]: string | undefined;
}

export interface ParsedContact {
  firstName: string;
  lastName: string;
  socialNumber: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  notes: string;
}

export interface DuplicateContact extends ParsedContact {
  existingContact: Contact;
}

export interface XLSXWorkbook {
  SheetNames: string[];
  Sheets: { [key: string]: XLSXWorksheet };
}

export interface XLSXWorksheet {
  [key: string]: XLSXCell | string | undefined;
  "!ref"?: string;
}

export interface XLSXCell {
  v: string | number;
  t: string;
  w?: string;
}

export interface TauriMock {
  tauri: {
    invoke: jest.Mock;
  };
}

export interface GlobalWithTauri {
  window: Window & {
    __TAURI__: TauriMock;
  };
}

export interface I18nMock {
  changeLanguage: jest.Mock;
  language: string;
}

export interface TranslationFunction {
  (key: string, params?: TranslationParams): string;
}

export interface UseTranslationMock {
  t: TranslationFunction;
  i18n: I18nMock;
}
