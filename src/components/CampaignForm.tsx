import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Campaign } from "../types";

interface CampaignFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: Omit<Campaign, "id" | "createdDate" | "sentCount" | "totalCount">) => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ isOpen, onClose, onSave }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    scheduledDate: "",
    status: "draft" as const,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = t("campaignForm.titleRequired");
    }
    if (!formData.message.trim()) {
      newErrors.message = t("campaignForm.messageRequired");
    }
    if (formData.message.length > 160) {
      newErrors.message = t("campaignForm.messageTooLong");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
      onClose();
      setFormData({
        title: "",
        message: "",
        scheduledDate: "",
        status: "draft",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Dialog Header */}
        <div className="modal-header">
          <h2 className="text-lg font-semibold text-gray-900">{t("campaignForm.title")}</h2>
          <button onClick={onClose} className="modal-close-btn">
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* Dialog Content */}
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("campaignForm.campaignTitle")} *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.title ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder={t("campaignForm.titlePlaceholder")}
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("campaignForm.message")} *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.message ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                rows={4}
                placeholder={t("campaignForm.messagePlaceholder")}
              />
              <div className="flex justify-between mt-2">
                {errors.message && <p className="text-red-600 text-sm">{errors.message}</p>}
                <p
                  className={`text-sm ml-auto ${
                    formData.message.length > 160 ? "text-red-600" : "text-gray-500"
                  }`}
                >
                  {formData.message.length}/160 {t("campaignForm.characters")}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("campaignForm.schedule")}
              </label>
              <input
                type="datetime-local"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-gray-500 text-sm mt-1">{t("campaignForm.scheduleDesc")}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-3 flex items-center">
                <span className="mr-2">📱</span>
                {t("campaignForm.preview")}
              </h3>
              <div className="bg-white border border-blue-200 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-2">{t("campaignForm.previewFrom")}</div>
                <div className="text-sm text-gray-800 leading-relaxed">
                  {formData.message || t("campaignForm.previewPlaceholder")}
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="flex space-x-3 pt-4">
              <button type="button" onClick={onClose} className="native-btn-secondary flex-1">
                {t("campaignForm.cancel")}
              </button>
              <button type="submit" onClick={handleSubmit} className="native-btn-primary flex-1">
                {formData.scheduledDate
                  ? t("campaignForm.scheduleButton")
                  : t("campaignForm.sendButton")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CampaignForm;
