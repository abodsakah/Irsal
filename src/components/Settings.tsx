import React, { useState } from "react";
import { TwilioConfig } from "../types";
import { useTranslation } from "react-i18next";

interface SettingsProps {
  config: TwilioConfig;
  onUpdateConfig: (config: TwilioConfig) => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onUpdateConfig }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    accountSid: config.accountSid,
    authToken: config.authToken,
    phoneNumber: config.phoneNumber,
  });

  const [showTokens, setShowTokens] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      ...formData,
      isConfigured: !!(formData.accountSid && formData.authToken && formData.phoneNumber),
    });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const testConfiguration = () => {
    // Mock test - in real implementation this would test Twilio connection
    alert(t("settings.testSuccess"));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t("settings.title")}</h2>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              config.isConfigured ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {config.isConfigured ? t("settings.configured") : t("settings.notConfigured")}
          </span>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">{t("settings.twilioConfig")}</h3>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-primary">
              {t("settings.editConfig")}
            </button>
          )}
        </div>

        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="input-label">{t("settings.accountSid")}</label>
              <div className="input-field bg-gray-50">
                {config.accountSid
                  ? "••••••••••••••••••••••••••••••••••••"
                  : t("settings.notConfiguredText")}
              </div>
            </div>

            <div>
              <label className="input-label">{t("settings.authToken")}</label>
              <div className="input-field bg-gray-50">
                {config.authToken
                  ? "••••••••••••••••••••••••••••••••••••"
                  : t("settings.notConfiguredText")}
              </div>
            </div>

            <div>
              <label className="input-label">{t("settings.phoneNumber")}</label>
              <div className="input-field bg-gray-50">
                {config.phoneNumber || t("settings.notConfiguredText")}
              </div>
            </div>

            {config.isConfigured && (
              <button onClick={testConfiguration} className="btn-success">
                {t("settings.testConfig")}
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">{t("settings.accountSid")} *</label>
              <input
                type={showTokens ? "text" : "password"}
                name="accountSid"
                value={formData.accountSid}
                onChange={handleChange}
                className="input-field"
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                required
              />
              <p className="text-sm text-gray-500 mt-1">{t("settings.accountSidDesc")}</p>
            </div>

            <div>
              <label className="input-label">{t("settings.authToken")} *</label>
              <input
                type={showTokens ? "text" : "password"}
                name="authToken"
                value={formData.authToken}
                onChange={handleChange}
                className="input-field"
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                required
              />
              <p className="text-sm text-gray-500 mt-1">{t("settings.authTokenDesc")}</p>
            </div>

            <div>
              <label className="input-label">{t("settings.phoneNumber")} *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="input-field"
                placeholder="+1234567890"
                required
              />
              <p className="text-sm text-gray-500 mt-1">{t("settings.phoneNumberDesc")}</p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showTokens"
                checked={showTokens}
                onChange={(e) => setShowTokens(e.target.checked)}
                className="h-4 w-4 text-mosque-600 focus:ring-mosque-500 border-gray-300 rounded"
              />
              <label htmlFor="showTokens" className="ml-2 text-sm text-gray-700">
                {t("settings.showSensitive")}
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary flex-1"
              >
                {t("settings.cancel")}
              </button>
              <button type="submit" className="btn-primary flex-1">
                {t("settings.save")}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("settings.gettingStarted")}</h3>
        <div className="space-y-4 text-sm text-gray-600">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">{t("settings.setupInstructions")}</h4>
            <ol className="list-decimal list-inside space-y-1 text-blue-700">
              <li>{t("settings.step1")}</li>
              <li>{t("settings.step2")}</li>
              <li>{t("settings.step3")}</li>
              <li>{t("settings.step4")}</li>
            </ol>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <h4 className="font-medium text-amber-800 mb-2">{t("settings.pricingInfo")}</h4>
            <p className="text-amber-700">{t("settings.pricingDesc")}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">{t("settings.securityNotes")}</h4>
            <ul className="list-disc list-inside space-y-1 text-green-700">
              <li>{t("settings.security1")}</li>
              <li>{t("settings.security2")}</li>
              <li>{t("settings.security3")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
