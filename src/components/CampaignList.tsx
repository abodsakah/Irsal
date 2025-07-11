import React from "react";
import { useTranslation } from "react-i18next";
import { Campaign } from "../types";

interface CampaignListProps {
  campaigns: Campaign[];
  onDeleteCampaign: (campaignId: string) => void;
}

const CampaignList: React.FC<CampaignListProps> = ({ campaigns, onDeleteCampaign }) => {
  const { t } = useTranslation();
  const getStatusBadge = (status: Campaign["status"]) => {
    const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "draft":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case "scheduled":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "sent":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "failed":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status: Campaign["status"]) => {
    switch (status) {
      case "draft":
        return "📝";
      case "scheduled":
        return "⏰";
      case "sent":
        return "✅";
      case "failed":
        return "❌";
      default:
        return "📝";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t("campaigns.title")}</h2>
        <div className="text-sm text-gray-600">
          {t("campaigns.total", { count: campaigns.length })}
        </div>
      </div>

      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getStatusIcon(campaign.status)}</span>
                  <h3 className="text-lg font-semibold text-gray-800">{campaign.title}</h3>
                  <span className={getStatusBadge(campaign.status)}>
                    {campaign.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-gray-600 mb-3 leading-relaxed">{campaign.message}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-mosque-100 text-mosque-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {t("campaigns.allContacts")}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">{t("campaigns.created")}:</span>
                    <br />
                    {new Date(campaign.createdDate).toLocaleDateString()}
                  </div>

                  {campaign.scheduledDate && (
                    <div>
                      <span className="font-medium">{t("campaigns.scheduled")}:</span>
                      <br />
                      {new Date(campaign.scheduledDate).toLocaleString()}
                    </div>
                  )}

                  <div>
                    <span className="font-medium">{t("campaigns.recipients")}:</span>
                    <br />
                    {campaign.totalCount} {t("nav.contacts")}
                  </div>

                  {campaign.status === "sent" && (
                    <div>
                      <span className="font-medium">{t("campaigns.delivery")}:</span>
                      <br />
                      {campaign.sentCount}/{campaign.totalCount} {t("campaigns.sent")}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                {campaign.status === "draft" && (
                  <button className="btn-primary text-sm py-1 px-3">
                    {t("campaigns.sendNow")}
                  </button>
                )}

                {campaign.status === "scheduled" && (
                  <button className="btn-secondary text-sm py-1 px-3">
                    {t("campaigns.editSchedule")}
                  </button>
                )}

                <button
                  onClick={() => onDeleteCampaign(campaign.id)}
                  className="btn-danger text-sm py-1 px-3"
                >
                  Delete
                </button>
              </div>
            </div>

            {campaign.status === "sent" && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center text-green-800">
                  <span className="mr-2">✅</span>
                  {t("campaigns.successMessage", {
                    count: campaign.sentCount,
                  })}
                </div>
              </div>
            )}

            {campaign.status === "failed" && (
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="flex items-center text-red-800">
                  <span className="mr-2">❌</span>
                  {t("campaigns.failureMessage")}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📢</div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">{t("campaigns.noCampaigns")}</h3>
          <p className="text-gray-500">{t("campaigns.noCampaignsDesc")}</p>
        </div>
      )}
    </div>
  );
};

export default CampaignList;
