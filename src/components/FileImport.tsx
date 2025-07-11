import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Contact, ParsedContact, DuplicateContact } from "../types";
import { ImportService, ImportOptions } from "../services/import-service";

interface FileImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (contacts: Omit<Contact, "id" | "addedDate">[]) => void;
  existingContacts: Contact[];
}

const FileImport: React.FC<FileImportProps> = ({ isOpen, onClose, onImport, existingContacts }) => {
  const { t } = useTranslation();
  const [csvData, setCsvData] = useState("");
  const [previewData, setPreviewData] = useState<ParsedContact[]>([]);
  const [duplicates, setDuplicates] = useState<DuplicateContact[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [duplicateHandling, setDuplicateHandling] = useState<"skip" | "overwrite" | "keep-both">(
    "skip"
  );

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCsvData(text);

    if (text.trim()) {
      const result = ImportService.parseCSV(text);
      const { newContacts, duplicateContacts } = ImportService.processDuplicates(
        result.parsedData,
        existingContacts
      );

      setPreviewData(newContacts);
      setDuplicates(duplicateContacts);
      setErrors(result.errors);
    } else {
      setPreviewData([]);
      setDuplicates([]);
      setErrors([]);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsProcessing(true);

    try {
      const result = await ImportService.parseFile(file, existingContacts);

      if (file.name.toLowerCase().endsWith(".csv")) {
        const text = await ImportService.readFileAsText(file);
        setCsvData(text);
      } else {
        setCsvData("");
      }

      setPreviewData(result.parsedData);
      setDuplicates(result.duplicates);
      setErrors(result.errors);
    } catch {
      setErrors([t("csvImport.parseError")]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (previewData.length === 0 && duplicates.length === 0) {
      setErrors([t("csvImport.noValidData")]);
      return;
    }

    setIsProcessing(true);
    try {
      const options: ImportOptions = { duplicateHandling };
      const contactsToImport = ImportService.processImport(previewData, duplicates, options);

      onImport(contactsToImport);
      onClose();
      setCsvData("");
      setPreviewData([]);
      setDuplicates([]);
      setErrors([]);
    } catch {
      setErrors([t("csvImport.importError")]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setCsvData("");
    setPreviewData([]);
    setDuplicates([]);
    setErrors([]);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "800px" }}>
        <div className="modal-header">
          <h2 className="text-xl font-bold text-gray-800">{t("csvImport.title")}</h2>
          <button onClick={handleClose} className="modal-close-btn">
            <span className="text-2xl">✕</span>
          </button>
        </div>

        <div className="modal-body">
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">{t("csvImport.instructions")}</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>{t("csvImport.formatDescription")}</p>
                <p className="font-mono bg-blue-100 p-2 rounded">
                  FirstName;LastName;SocialNumber;Address;PostalCode;City;Mobile
                </p>
                <p>{t("csvImport.requiredFields")}</p>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("csvImport.uploadFile")}
              </label>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                disabled={isProcessing}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />
              {isProcessing && (
                <p className="text-sm text-blue-600 mt-1">{t("csvImport.processingFile")}</p>
              )}
            </div>

            {/* Or Manual Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("csvImport.pasteData")}
              </label>
              <textarea
                value={csvData}
                onChange={handleTextAreaChange}
                placeholder={t("csvImport.placeholder")}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">{t("csvImport.errors")}</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Duplicates Section */}
            {duplicates.length > 0 && (
              <div>
                <h3 className="font-medium text-orange-900 mb-3">
                  {t("csvImport.duplicatesFound")} ({duplicates.length} {t("csvImport.contacts")})
                </h3>

                {/* Duplicate Handling Options */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-orange-800 mb-3">
                    {t("csvImport.duplicateHandling")}
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="duplicateHandling"
                        value="skip"
                        checked={duplicateHandling === "skip"}
                        onChange={(e) =>
                          setDuplicateHandling(e.target.value as "skip" | "overwrite" | "keep-both")
                        }
                        className="mr-2"
                      />
                      <span className="text-sm text-orange-700">
                        {t("csvImport.skipDuplicates")} ({t("csvImport.recommended")})
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="duplicateHandling"
                        value="overwrite"
                        checked={duplicateHandling === "overwrite"}
                        onChange={(e) =>
                          setDuplicateHandling(e.target.value as "skip" | "overwrite" | "keep-both")
                        }
                        className="mr-2"
                      />
                      <span className="text-sm text-orange-700">
                        {t("csvImport.overwriteExisting")}
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="duplicateHandling"
                        value="keep-both"
                        checked={duplicateHandling === "keep-both"}
                        onChange={(e) =>
                          setDuplicateHandling(e.target.value as "skip" | "overwrite" | "keep-both")
                        }
                        className="mr-2"
                      />
                      <span className="text-sm text-orange-700">{t("csvImport.keepBoth")}</span>
                    </label>
                  </div>
                </div>

                {/* Duplicate Preview Table */}
                <div className="overflow-x-auto max-h-40 border border-orange-200 rounded-lg">
                  <table className="min-w-full divide-y divide-orange-200">
                    <thead className="bg-orange-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-orange-500 uppercase">
                          {t("csvImport.firstName")}
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-orange-500 uppercase">
                          {t("csvImport.lastName")}
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-orange-500 uppercase">
                          {t("csvImport.phone")}
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-orange-500 uppercase">
                          {t("csvImport.existingMatch")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-orange-200">
                      {duplicates.slice(0, 5).map((duplicate, index) => (
                        <tr key={index} className="hover:bg-orange-50">
                          <td className="px-3 py-2 text-sm text-gray-900">{duplicate.firstName}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{duplicate.lastName}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{duplicate.phone}</td>
                          <td className="px-3 py-2 text-sm text-orange-600">
                            {duplicate.existingContact.firstName}{" "}
                            {duplicate.existingContact.lastName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {duplicates.length > 5 && (
                    <div className="px-3 py-2 text-sm text-orange-500 bg-orange-50 text-center">
                      {t("csvImport.showingFirst5", { total: duplicates.length })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Preview */}
            {previewData.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">
                  {t("csvImport.preview")} ({previewData.length} {t("csvImport.contacts")})
                </h3>
                <div className="overflow-x-auto max-h-64 border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          {t("csvImport.firstName")}
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          {t("csvImport.lastName")}
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          {t("csvImport.phone")}
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          {t("csvImport.city")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {previewData.slice(0, 10).map((contact, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-900">{contact.firstName}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{contact.lastName}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{contact.phone}</td>
                          <td className="px-3 py-2 text-sm text-gray-500">{contact.city || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {previewData.length > 10 && (
                    <div className="px-3 py-2 text-sm text-gray-500 bg-gray-50 text-center">
                      {t("csvImport.showingFirst10", { total: previewData.length })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {t("csvImport.cancel")}
            </button>
            <button
              onClick={handleImport}
              disabled={
                (previewData.length === 0 && duplicates.length === 0) ||
                errors.length > 0 ||
                isProcessing
              }
              className="native-btn-primary"
            >
              {isProcessing
                ? t("csvImport.importing")
                : t("csvImport.import", {
                    count:
                      previewData.length + (duplicateHandling === "skip" ? 0 : duplicates.length),
                  })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileImport;
