import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Contact } from "../types";

interface ContactFormProps {
  contact?: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Omit<Contact, "id" | "addedDate">) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ contact, isOpen, onClose, onSave }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    firstName: contact?.firstName || "",
    lastName: contact?.lastName || "",
    city: contact?.city || "",
    phone: contact?.phone || "",
    notes: contact?.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = t("contactForm.firstNameRequired");
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = t("contactForm.lastNameRequired");
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t("contactForm.phoneRequired");
    }
    if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = t("contactForm.phoneInvalid");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
      onClose();
      setFormData({
        firstName: "",
        lastName: "",
        city: "",
        phone: "",
        notes: "",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
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
        <div className="modal-header">
          <h2 className="text-xl font-bold text-gray-800">
            {contact ? t("contactForm.editTitle") : t("contactForm.addTitle")}
          </h2>
          <button onClick={onClose} className="modal-close-btn">
            <span className="text-2xl">✕</span>
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">{t("contactForm.firstName")} *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`input-field ${errors.firstName ? "border-red-500" : ""}`}
                  placeholder={t("contactForm.firstNamePlaceholder")}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="input-label">{t("contactForm.lastName")} *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input-field ${errors.lastName ? "border-red-500" : ""}`}
                  placeholder={t("contactForm.lastNamePlaceholder")}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">{t("contactForm.city")}</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="input-field"
                  placeholder={t("contactForm.cityPlaceholder")}
                />
              </div>
            </div>

            <div>
              <label className="input-label">{t("contactForm.phone")} *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`input-field ${errors.phone ? "border-red-500" : ""}`}
                placeholder={t("contactForm.phonePlaceholder")}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="input-label">{t("contactForm.notes")}</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input-field resize-none"
                rows={3}
                placeholder={t("contactForm.notesPlaceholder")}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button type="button" onClick={onClose} className="native-btn-secondary flex-1">
                {t("contactForm.cancel")}
              </button>
              <button type="submit" className="native-btn-primary flex-1">
                {contact ? t("contactForm.update") : t("contactForm.add")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
