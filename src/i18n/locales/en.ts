export const en = {
	common: {
		loading: "Loading...",
		save: "Save",
		cancel: "Cancel",
		delete: "Delete",
		edit: "Edit",
		add: "Add",
		search: "Search",
		export: "Export",
		import: "Import",
		send: "Send",
		close: "Close",
		yes: "Yes",
		no: "No",
		success: "Success",
		error: "Error",
		required: "Required",
		optional: "Optional"
	},
	app: {
		title: "Irsal"
	},
	sidebar: {
		home: "Home",
		members: "Members",
		settings: "Settings"
	},
	home: {
		title: "Dashboard",
		subtitle: "Overview of your SMS campaigns and members",
		sendCampaign: "Send Campaign",
		stats: {
			totalMembers: "Total Members",
			recentCampaigns: "Recent Campaigns",
			messagesSent: "Messages Sent"
		},
		recentMembers: "Recent Members",
		noMembers: "No members found. Add some members to get started!",
		showingMembers: "Showing {{count}} of {{total}} members",
		modal: {
			title: "Send SMS Campaign",
			recipients: "Recipients: {{count}} members will receive this message",
			message: "Message",
			messagePlaceholder: "Enter your message here...",
			aiTranslate: "AI Translate",
			aiTranslateTooltip:
				"Automatically translate to create bilingual message (Arabic ↔ Swedish)",
			translating: "Translating...",
			characterCount: "{{count}} characters • {{sms}} SMS",
			characterCountPlural: "{{count}} characters • {{sms}} SMSs",
			charsUntilNext: "{{count}} chars until next SMS",
			sendToMembers: "Send to {{count}} members",
			sending: "Sending...",
			enterMessage: "Please enter a message",
			noMembers: "No members found to send messages to",
			confirmSend:
				"Are you sure you want to send this message to {{count}} members?",
			viewErrors: "View errors ({{count}})"
		}
	},
	members: {
		title: "Members",
		total: "{{count}} total",
		addMember: "Add Member",
		importMembers: "Import Members",
		exportMembers: "Export Members",
		searchPlaceholder: "Search members by name, phone, or city...",
		noMembers: "No members found",
		noMembersDescription: "Get started by adding your first member.",
		adjustSearch: "Try adjusting your search terms",
		table: {
			name: "Name",
			city: "City",
			phone: "Phone",
			added: "Added",
			actions: "Actions"
		},
		form: {
			firstName: "First Name",
			lastName: "Last Name",
			city: "City",
			phoneNumber: "Phone Number",
			firstNamePlaceholder: "Enter first name",
			lastNamePlaceholder: "Enter last name",
			cityPlaceholder: "Enter city (optional)",
			phonePlaceholder: "Enter phone number",
			fillRequired: "Please fill in all required fields",
			addMember: "Add Member",
			editMember: "Edit Member",
			saving: "Saving..."
		},
		import: {
			title: "Import Members",
			description: "Import members from CSV or Excel files",
			selectFile: "Select File",
			supportedFormats: "Supported formats: CSV, XLSX, XLS",
			expectedColumns:
				"Expected columns: FirstName, LastName, City (optional), Mobile",
			preview: "Preview ({{count}} members)",
			importMembers: "Import {{count}} Members",
			importing: "Importing...",
			selectFileFirst: "Please select a file first",
			invalidFile: "Please select a CSV or Excel file",
			parseError: "Error parsing file",
			importSuccess: "Successfully imported {{count}} members",
			importError:
				"Import completed with some errors: {{success}} successful, {{failed}} failed"
		},
		delete: {
			confirm: "Are you sure you want to delete this member?"
		}
	},
	settings: {
		title: "Settings",
		subtitle: "Configure your Twilio SMS and DeepSeek AI settings",
		twilio: {
			title: "Twilio Configuration",
			accountSid: "Account SID",
			accountSidDescription:
				'Your Twilio Account SID (34 characters, starts with "AC")',
			accountSidPlaceholder: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
			authToken: "Auth Token",
			authTokenDescription:
				"Your Twilio Auth Token (32 characters, keep this secret!)",
			authTokenPlaceholder: "32-character auth token",
			phoneNumber: "Twilio Phone Number",
			phoneNumberDescription:
				"The phone number you purchased from Twilio (including country code)",
			phoneNumberPlaceholder: "+1234567890",
			senderId: "Alphanumeric Sender ID",
			senderIdDescription:
				"Optional. Custom sender name (max 11 characters, letters and numbers only). Leave empty to use your Twilio phone number.",
			senderIdPlaceholder: "MOSQUE",
			charactersRemaining: "Characters remaining: {{count}}",
			saveSettings: "Save Settings",
			saving: "Saving...",
			saveSuccess: "Settings saved successfully!",
			saveFailed: "Failed to save settings. Please try again.",
			saveError: "Error saving settings. Please try again."
		},
		deepSeek: {
			title: "DeepSeek AI Translation",
			apiKey: "API Key",
			apiKeyDescription:
				"Your DeepSeek API key for AI translation services (keep this secret!)",
			apiKeyPlaceholder: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
			saveSettings: "Save Settings",
			saving: "Saving...",
			saveSuccess: "DeepSeek settings saved successfully!",
			saveFailed: "Failed to save DeepSeek settings. Please try again.",
			saveError: "Error saving DeepSeek settings. Please try again."
		},
		validation: {
			accountSidRequired: "Account SID is required",
			accountSidInvalid:
				"Account SID must start with 'AC' and be 34 characters long",
			authTokenRequired: "Auth Token is required",
			authTokenInvalid: "Auth Token must be 32 characters long",
			phoneNumberRequired: "Phone Number is required",
			phoneNumberInvalid:
				"Phone number must start with + and include country code",
			senderIdTooLong: "Sender ID must be 11 characters or less",
			senderIdInvalid: "Sender ID must contain only letters and numbers",
			deepSeekApiKeyRequired: "DeepSeek API key is required",
			deepSeekApiKeyInvalid:
				"DeepSeek API key must be at least 20 characters long"
		},
		help: {
			title: "How to get your Twilio credentials:",
			step1: "Log in to your Twilio Console",
			step2: "Find your Account SID and Auth Token on the dashboard",
			step3: "Purchase a phone number from the Phone Numbers section",
			step4:
				"(Optional) Set up an Alphanumeric Sender ID for supported countries"
		},
		deepSeekHelp: {
			title: "How to get your DeepSeek API key:",
			step1: "Create an account on DeepSeek Platform",
			step2: "Go to API Keys section in your dashboard",
			step3: "Create a new API key",
			step4: "Copy and paste the API key above (starts with 'sk-')"
		}
	}
};

export type LocaleKeys = typeof en;
