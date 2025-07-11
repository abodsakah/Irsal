import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  Megaphone,
  CheckCircle,
  Clock,
  Plus,
  Download,
  AlertTriangle,
  User,
} from "lucide-react";
import "./App.css";
import "./i18n";
import { Contact, Campaign, TwilioConfig } from "./types";
import ContactList from "./components/ContactList";
import ContactForm from "./components/ContactForm";
import CampaignList from "./components/CampaignList";
import CampaignForm from "./components/CampaignForm";
import Settings from "./components/Settings";
import LanguageSwitcher from "./components/LanguageSwitcher";
import FileImport from "./components/FileImport";

function App() {
  const { t } = useTranslation();
  // Mock data for demonstration
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      firstName: "Ahmed",
      lastName: "Abdullah",
      phone: "+46 70 123 45 67",
      notes: "Imam - Friday prayers",
      addedDate: "2024-01-15",
    },
    {
      id: "2",
      firstName: "Fatima",
      lastName: "Hassan",
      phone: "+46 73 987 65 43",
      notes: "Sister circle coordinator",
      addedDate: "2024-01-16",
    },
    {
      id: "3",
      firstName: "Omar",
      lastName: "Salim",
      phone: "+46 76 555 44 33",
      notes: "Youth group leader",
      addedDate: "2024-01-17",
    },
    {
      id: "4",
      firstName: "Ali",
      lastName: "Rahman",
      phone: "+46 72 111 22 33",
      addedDate: "2024-01-18",
    },
  ]);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      title: "Friday Prayer Reminder",
      message:
        "Assalamu alaikum! Reminder: Friday prayer is at 1:30 PM today. See you there, InshaAllah.",
      status: "sent",
      sentCount: 45,
      totalCount: 45,
      createdDate: "2024-01-15",
    },
    {
      id: "2",
      title: "Ramadan Iftar Event",
      message: "Join us for community iftar tomorrow at 6:30 PM. Bring your family and friends!",
      scheduledDate: "2024-03-15T18:00",
      status: "scheduled",
      sentCount: 0,
      totalCount: 78,
      createdDate: "2024-01-16",
    },
  ]);

  const [twilioConfig, setTwilioConfig] = useState<TwilioConfig>({
    accountSid: "",
    authToken: "",
    phoneNumber: "",
    isConfigured: false,
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isCampaignFormOpen, setIsCampaignFormOpen] = useState(false);
  const [isFileImportOpen, setIsFileImportOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const handleSaveContact = (contactData: Omit<Contact, "id" | "addedDate">) => {
    if (editingContact) {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === editingContact.id
            ? {
                ...contactData,
                id: editingContact.id,
                addedDate: editingContact.addedDate,
              }
            : c
        )
      );
      setEditingContact(null);
    } else {
      const newContact: Contact = {
        ...contactData,
        id: Date.now().toString(),
        addedDate: new Date().toISOString().split("T")[0],
      };
      setContacts((prev) => [...prev, newContact]);
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsContactFormOpen(true);
  };

  const handleDeleteContact = (contactId: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      setContacts((prev) => prev.filter((c) => c.id !== contactId));
    }
  };

  const handleImportContacts = (importedContacts: Omit<Contact, "id" | "addedDate">[]) => {
    const normalizePhone = (phone: string): string => {
      return phone.replace(/[\s\-\(\)]/g, "").toLowerCase();
    };

    const newContacts: Contact[] = importedContacts.map((contact, index) => ({
      ...contact,
      id: (Date.now() + index).toString(),
      addedDate: new Date().toISOString().split("T")[0],
    }));

    const existingPhones = new Set(contacts.map((c) => normalizePhone(c.phone)));
    const contactsToOverwrite = newContacts.filter((nc) =>
      existingPhones.has(normalizePhone(nc.phone))
    );

    if (contactsToOverwrite.length > 0) {
      const updatedExistingContacts = contacts.filter((existingContact) => {
        const existingNormalized = normalizePhone(existingContact.phone);
        return !contactsToOverwrite.some(
          (newContact) => normalizePhone(newContact.phone) === existingNormalized
        );
      });

      setContacts([...updatedExistingContacts, ...newContacts]);
    } else {
      setContacts((prev) => [...prev, ...newContacts]);
    }

    // TODO: Add proper notification system
  };

  const handleSaveCampaign = (
    campaignData: Omit<Campaign, "id" | "createdDate" | "sentCount" | "totalCount">
  ) => {
    const recipientCount = contacts.length;

    const newCampaign: Campaign = {
      ...campaignData,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split("T")[0],
      sentCount: 0,
      totalCount: recipientCount,
    };
    setCampaigns((prev) => [...prev, newCampaign]);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    }
  };

  const stats = {
    totalContacts: contacts.length,
    totalCampaigns: campaigns.length,
    sentCampaigns: campaigns.filter((c) => c.status === "sent").length,
    scheduledCampaigns: campaigns.filter((c) => c.status === "scheduled").length,
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Twilio Status Banner */}
      {!twilioConfig.isConfigured && (
        <div className="native-alert-warning">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-3" />
            <span className="font-medium">{t("dashboard.twilioNotConfigured")}</span>
          </div>
          <button onClick={() => setActiveTab("settings")} className="native-btn-secondary-sm ml-4">
            {t("dashboard.configureNow")}
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="native-stat-card">
          <div className="flex items-center rtl-reverse">
            <div className="native-stat-icon bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t("dashboard.totalContacts")}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalContacts}</p>
            </div>
          </div>
        </div>

        <div className="native-stat-card">
          <div className="flex items-center rtl-reverse">
            <div className="native-stat-icon bg-green-100">
              <Megaphone className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t("dashboard.totalCampaigns")}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCampaigns}</p>
            </div>
          </div>
        </div>

        <div className="native-stat-card">
          <div className="flex items-center rtl-reverse">
            <div className="native-stat-icon bg-blue-100">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t("dashboard.sentCampaigns")}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.sentCampaigns}</p>
            </div>
          </div>
        </div>

        <div className="native-stat-card">
          <div className="flex items-center rtl-reverse">
            <div className="native-stat-icon bg-orange-100">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t("dashboard.scheduled")}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.scheduledCampaigns}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="native-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("dashboard.quickActions")}</h2>
        <div className="quick-actions-grid">
          <button onClick={() => setIsContactFormOpen(true)} className="native-quick-action">
            <div className="native-quick-action-icon bg-blue-50">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{t("dashboard.addNewContact")}</h3>
              <p className="text-sm text-gray-500">Add a new community member</p>
            </div>
          </button>

          <button onClick={() => setIsCampaignFormOpen(true)} className="native-quick-action">
            <div className="native-quick-action-icon bg-green-50">
              <Megaphone className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{t("dashboard.createSMSCampaign")}</h3>
              <p className="text-sm text-gray-500">Send messages to groups</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="native-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t("dashboard.recentActivity")}
        </h2>
        <div className="space-y-3">
          {campaigns.slice(0, 3).map((campaign) => (
            <div key={campaign.id} className="native-activity-item">
              <div className="flex items-center rtl-reverse">
                <div
                  className={`native-activity-status ${
                    campaign.status === "sent"
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {campaign.status === "sent" ? "✓" : "⏰"}
                </div>
                <div className="flex-1 ml-3">
                  <p className="text-sm font-medium text-gray-900">{campaign.title}</p>
                  <p className="text-xs text-gray-500">
                    {campaign.status === "sent"
                      ? t("dashboard.sent")
                      : t("dashboard.scheduledStatus")}{" "}
                    • {t("campaigns.allContacts")}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(campaign.createdDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "dashboard", name: t("nav.dashboard"), icon: "🏠" },
    { id: "contacts", name: t("nav.contacts"), icon: "👥" },
    { id: "campaigns", name: t("nav.campaigns"), icon: "📢" },
    { id: "settings", name: t("nav.settings"), icon: "⚙️" },
  ];

  return (
    <div className="app-window" dir={document.documentElement.dir}>
      {/* Sidebar Navigation */}
      <div className="sidebar">
        {/* App Header */}
        <div className="sidebar-header">
          <h1 className="text-lg font-semibold text-gray-900">{t("nav.title")}</h1>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`sidebar-nav-item ${activeTab === tab.id ? "active" : ""}`}
            >
              <span className="text-base mr-3">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>

        {/* Language Switcher at bottom */}
        <div className="sidebar-footer">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Content Header */}
        <div className="content-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {activeTab === "dashboard" && t("nav.dashboard")}
                {activeTab === "contacts" && t("contacts.title")}
                {activeTab === "campaigns" && t("campaigns.title")}
                {activeTab === "settings" && t("nav.settings")}
              </h1>
              {activeTab === "contacts" && (
                <p className="text-sm text-gray-500">
                  {t("contacts.total", { count: contacts.length })}
                </p>
              )}
              {activeTab === "campaigns" && (
                <p className="text-sm text-gray-500">
                  {t("campaigns.total", { count: campaigns.length })}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 rtl-reverse">
              {activeTab === "contacts" && (
                <>
                  <button
                    onClick={() => setIsFileImportOpen(true)}
                    className="native-btn-secondary"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t("contacts.importCSV")}
                  </button>
                  <button onClick={() => setIsContactFormOpen(true)} className="native-btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    {t("contacts.addNew")}
                  </button>
                </>
              )}
              {activeTab === "campaigns" && (
                <button onClick={() => setIsCampaignFormOpen(true)} className="native-btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  {t("campaigns.create")}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="content-body">
          {activeTab === "dashboard" && renderDashboard()}

          {activeTab === "contacts" && (
            <ContactList
              contacts={contacts}
              onEditContact={handleEditContact}
              onDeleteContact={handleDeleteContact}
            />
          )}

          {activeTab === "campaigns" && (
            <CampaignList campaigns={campaigns} onDeleteCampaign={handleDeleteCampaign} />
          )}

          {activeTab === "settings" && (
            <Settings config={twilioConfig} onUpdateConfig={setTwilioConfig} />
          )}
        </div>
      </div>

      {/* Modals */}
      <ContactForm
        contact={editingContact}
        isOpen={isContactFormOpen}
        onClose={() => {
          setIsContactFormOpen(false);
          setEditingContact(null);
        }}
        onSave={handleSaveContact}
      />

      <CampaignForm
        isOpen={isCampaignFormOpen}
        onClose={() => setIsCampaignFormOpen(false)}
        onSave={handleSaveCampaign}
      />

      <FileImport
        isOpen={isFileImportOpen}
        onClose={() => setIsFileImportOpen(false)}
        onImport={handleImportContacts}
        existingContacts={contacts}
      />
    </div>
  );
}

export default App;
