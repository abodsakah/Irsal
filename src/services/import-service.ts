import * as XLSX from "xlsx";
import { Contact, ParsedContact, DuplicateContact } from "../types";
import i18next from "i18next";

export interface ImportOptions {
  duplicateHandling: "skip" | "overwrite" | "keep-both";
}

export interface ParsingResult {
  parsedData: ParsedContact[];
  duplicates: DuplicateContact[];
  errors: string[];
}

class ImportServiceImpl {
  // Normalize phone number for comparison (remove spaces, dashes, parentheses)
  private normalizePhone(phone: string): string {
    return phone.replace(/[\s\-\(\)]/g, "").toLowerCase();
  }

  // Process and identify duplicates
  public processDuplicates(
    parsedContacts: ParsedContact[],
    existingContacts: Contact[]
  ): { newContacts: ParsedContact[]; duplicateContacts: DuplicateContact[] } {
    const existingPhones = new Set(
      existingContacts.map((contact) => this.normalizePhone(contact.phone))
    );
    const newContacts: ParsedContact[] = [];
    const duplicateContacts: DuplicateContact[] = [];

    parsedContacts.forEach((contact) => {
      const normalizedPhone = this.normalizePhone(contact.phone);
      if (existingPhones.has(normalizedPhone)) {
        const existingContact = existingContacts.find(
          (ec) => this.normalizePhone(ec.phone) === normalizedPhone
        );
        if (existingContact) {
          duplicateContacts.push({
            ...contact,
            existingContact,
          });
        }
      } else {
        newContacts.push(contact);
      }
    });

    return { newContacts, duplicateContacts };
  }

  public parseCSV(csvText: string): ParsingResult {
    const t = i18next.t;
    const lines = csvText.trim().split("\n");
    const errors: string[] = [];

    if (lines.length < 2) {
      return { parsedData: [], duplicates: [], errors: [t("csvImport.noData")] };
    }

    const headers = lines[0].split(";").map((h) => h.trim());
    const expectedHeaders = [
      "FirstName",
      "LastName",
      "SocialNumber",
      "Address",
      "PostalCode",
      "City",
      "Mobile",
    ];

    if (
      headers.length !== expectedHeaders.length ||
      !expectedHeaders.every((h, i) => headers[i] === h)
    ) {
      return { parsedData: [], duplicates: [], errors: [t("csvImport.invalidFormat")] };
    }

    const parsedData: ParsedContact[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(";").map((v) => v.trim());

      if (values.length !== headers.length) {
        errors.push(t("csvImport.invalidRowFormat", { row: i + 1 }));
        continue;
      }

      const [firstName, lastName, socialNumber, address, postalCode, city, mobile] = values;

      if (!firstName || !lastName || !mobile) {
        errors.push(t("csvImport.missingRequiredFields", { row: i + 1 }));
        continue;
      }

      if (!/^\+?[\d\s\-\(\)]+$/.test(mobile)) {
        errors.push(t("csvImport.invalidPhoneFormat", { row: i + 1, phone: mobile }));
        continue;
      }

      parsedData.push({
        firstName,
        lastName,
        socialNumber: socialNumber || "",
        address: address || "",
        postalCode: postalCode || "",
        city: city || "",
        phone: mobile,
        notes: "",
      });
    }

    return { parsedData, duplicates: [], errors };
  }

  public async parseXLSX(file: File): Promise<ParsingResult> {
    const t = i18next.t;

    try {
      const data = await this.readFileAsArrayBuffer(file);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number)[][];

      if (jsonData.length < 2) {
        return { parsedData: [], duplicates: [], errors: [t("csvImport.noData")] };
      }

      const headers = (jsonData[0] as (string | number)[]).map((h) => String(h).trim());
      const expectedHeaders = [
        "FirstName",
        "LastName",
        "SocialNumber",
        "Address",
        "PostalCode",
        "City",
        "Mobile",
      ];

      if (
        headers.length !== expectedHeaders.length ||
        !expectedHeaders.every((h, i) => headers[i] === h)
      ) {
        return { parsedData: [], duplicates: [], errors: [t("csvImport.invalidFormat")] };
      }

      const parsedData: ParsedContact[] = [];
      const errors: string[] = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as (string | number)[];

        if (!row || row.length !== headers.length) {
          errors.push(t("csvImport.invalidRowFormat", { row: i + 1 }));
          continue;
        }

        const [firstName, lastName, socialNumber, address, postalCode, city, mobile] = row.map(
          (v) => String(v || "").trim()
        );

        if (!firstName || !lastName || !mobile) {
          errors.push(t("csvImport.missingRequiredFields", { row: i + 1 }));
          continue;
        }

        if (!/^\+?[\d\s\-\(\)]+$/.test(mobile)) {
          errors.push(t("csvImport.invalidPhoneFormat", { row: i + 1, phone: mobile }));
          continue;
        }

        parsedData.push({
          firstName,
          lastName,
          socialNumber: socialNumber || "",
          address: address || "",
          postalCode: postalCode || "",
          city: city || "",
          phone: mobile,
          notes: "",
        });
      }

      return { parsedData, duplicates: [], errors };
    } catch {
      return { parsedData: [], duplicates: [], errors: [t("csvImport.parseError")] };
    }
  }

  public processImport(
    newContacts: ParsedContact[],
    duplicates: DuplicateContact[],
    options: ImportOptions
  ): Omit<Contact, "id" | "addedDate">[] {
    let contactsToImport = [...newContacts];

    if (duplicates.length > 0) {
      if (options.duplicateHandling === "overwrite") {
        contactsToImport = [
          ...contactsToImport,
          ...duplicates.map((d) => ({
            firstName: d.firstName,
            lastName: d.lastName,
            socialNumber: d.socialNumber,
            address: d.address,
            postalCode: d.postalCode,
            city: d.city,
            phone: d.phone,
            notes: d.notes || "",
          })),
        ];
      } else if (options.duplicateHandling === "keep-both") {
        contactsToImport = [
          ...contactsToImport,
          ...duplicates.map((d, index) => ({
            firstName: d.firstName,
            lastName: d.lastName,
            socialNumber: d.socialNumber,
            address: d.address,
            postalCode: d.postalCode,
            city: d.city,
            phone: d.phone + ` (${index + 2})`, // Add suffix to make unique
            notes: (d.notes || "") + (d.notes ? " " : "") + "(Duplicate contact)",
          })),
        ];
      }
    }

    return contactsToImport;
  }

  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result instanceof ArrayBuffer) {
          resolve(e.target.result);
        } else {
          reject(new Error("Failed to read file as ArrayBuffer"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  public readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          resolve(e.target.result);
        } else {
          reject(new Error("Failed to read file as text"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  public async parseFile(file: File, existingContacts: Contact[]): Promise<ParsingResult> {
    const t = i18next.t;
    const fileName = file.name.toLowerCase();
    const isCSV = fileName.endsWith(".csv");
    const isXLSX = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");

    if (!isCSV && !isXLSX) {
      return {
        parsedData: [],
        duplicates: [],
        errors: [t("csvImport.invalidFileType")],
      };
    }

    try {
      let result: ParsingResult;

      if (isCSV) {
        const text = await this.readFileAsText(file);
        result = this.parseCSV(text);
      } else {
        result = await this.parseXLSX(file);
      }

      // Process duplicates
      const { newContacts, duplicateContacts } = this.processDuplicates(
        result.parsedData,
        existingContacts
      );

      return {
        parsedData: newContacts,
        duplicates: duplicateContacts,
        errors: result.errors,
      };
    } catch {
      return {
        parsedData: [],
        duplicates: [],
        errors: [t("csvImport.parseError")],
      };
    }
  }
}

export const ImportService = new ImportServiceImpl();
