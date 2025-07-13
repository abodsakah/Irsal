import { LocaleKeys } from "./en";

export const sv: LocaleKeys = {
	common: {
		loading: "Laddar...",
		save: "Spara",
		cancel: "Avbryt",
		delete: "Ta bort",
		edit: "Redigera",
		add: "Lägg till",
		search: "Sök",
		export: "Exportera",
		import: "Importera",
		send: "Skicka",
		close: "Stäng",
		yes: "Ja",
		no: "Nej",
		success: "Framgång",
		error: "Fel",
		required: "Obligatorisk",
		optional: "Valfri"
	},
	app: {
		title: "Irsal"
	},
	sidebar: {
		home: "Hem",
		members: "Medlemmar",
		settings: "Inställningar"
	},
	home: {
		title: "Instrumentpanel",
		subtitle: "Översikt av dina SMS-kampanjer och medlemmar",
		sendCampaign: "Skicka kampanj",
		stats: {
			totalMembers: "Totalt medlemmar",
			recentCampaigns: "Senaste kampanjer",
			messagesSent: "Meddelanden skickade"
		},
		recentMembers: "Senaste medlemmar",
		noMembers:
			"Inga medlemmar hittades. Lägg till några medlemmar för att komma igång!",
		showingMembers: "Visar {{count}} av {{total}} medlemmar",
		modal: {
			title: "Skicka SMS-kampanj",
			recipients:
				"Mottagare: {{count}} medlemmar kommer att få detta meddelande",
			message: "Meddelande",
			messagePlaceholder: "Skriv ditt meddelande här...",
			aiTranslate: "AI-översätt",
			aiTranslateTooltip:
				"Översätt automatiskt för att skapa tvåspråkigt meddelande (arabiska ↔ svenska)",
			translating: "Översätter...",
			characterCount: "{{count}} tecken • {{sms}} SMS",
			characterCountPlural: "{{count}} tecken • {{sms}} SMS",
			charsUntilNext: "{{count}} tecken till nästa SMS",
			sendToMembers: "Skicka till {{count}} medlemmar",
			sending: "Skickar...",
			enterMessage: "Vänligen ange ett meddelande",
			noMembers: "Inga medlemmar hittades att skicka meddelanden till",
			confirmSend:
				"Är du säker på att du vill skicka detta meddelande till {{count}} medlemmar?",
			viewErrors: "Visa fel ({{count}})"
		}
	},
	members: {
		title: "Medlemmar",
		total: "{{count}} totalt",
		addMember: "Lägg till medlem",
		importMembers: "Importera medlemmar",
		exportMembers: "Exportera medlemmar",
		searchPlaceholder: "Sök medlemmar efter namn, telefon eller stad...",
		noMembers: "Inga medlemmar hittades",
		noMembersDescription: "Kom igång genom att lägga till din första medlem.",
		adjustSearch: "Prova att justera dina söktermer",
		table: {
			name: "Namn",
			city: "Stad",
			phone: "Telefon",
			added: "Tillagd",
			actions: "Åtgärder"
		},
		form: {
			firstName: "Förnamn",
			lastName: "Efternamn",
			city: "Stad",
			phoneNumber: "Telefonnummer",
			firstNamePlaceholder: "Ange förnamn",
			lastNamePlaceholder: "Ange efternamn",
			cityPlaceholder: "Ange stad (valfritt)",
			phonePlaceholder: "Ange telefonnummer",
			fillRequired: "Vänligen fyll i alla obligatoriska fält",
			addMember: "Lägg till medlem",
			editMember: "Redigera medlem",
			saving: "Sparar..."
		},
		import: {
			title: "Importera medlemmar",
			description: "Importera medlemmar från CSV- eller Excel-filer",
			selectFile: "Välj fil",
			supportedFormats: "Stödda format: CSV, XLSX, XLS",
			expectedColumns:
				"Förväntade kolumner: FirstName, LastName, City (valfritt), Mobile",
			preview: "Förhandsgranska ({{count}} medlemmar)",
			importMembers: "Importera {{count}} medlemmar",
			importing: "Importerar...",
			selectFileFirst: "Vänligen välj en fil först",
			invalidFile: "Vänligen välj en CSV- eller Excel-fil",
			parseError: "Fel vid tolkning av fil",
			importSuccess: "Importerade framgångsrikt {{count}} medlemmar",
			importError:
				"Import slutförd med några fel: {{success}} framgångsrika, {{failed}} misslyckade"
		},
		delete: {
			confirm: "Är du säker på att du vill ta bort denna medlem?"
		}
	},
	settings: {
		title: "Inställningar",
		subtitle: "Konfigurera dina Twilio SMS-inställningar",
		twilio: {
			title: "Twilio-konfiguration",
			accountSid: "Konto-SID",
			accountSidDescription:
				'Ditt Twilio-konto-SID (34 tecken, börjar med "AC")',
			accountSidPlaceholder: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
			authToken: "Autentiseringstoken",
			authTokenDescription:
				"Din Twilio-autentiseringstoken (32 tecken, håll detta hemligt!)",
			authTokenPlaceholder: "32-teckens autentiseringstoken",
			phoneNumber: "Twilio-telefonnummer",
			phoneNumberDescription:
				"Telefonnumret du köpte från Twilio (inklusive landskod)",
			phoneNumberPlaceholder: "+46701234567",
			senderId: "Alfanumeriskt avsändar-ID",
			senderIdDescription:
				"Valfritt. Anpassat avsändarnamn (max 11 tecken, endast bokstäver och siffror). Lämna tomt för att använda ditt Twilio-telefonnummer.",
			senderIdPlaceholder: "MOSKE",
			charactersRemaining: "Tecken kvar: {{count}}",
			saveSettings: "Spara inställningar",
			saving: "Sparar...",
			saveSuccess: "Inställningar sparade framgångsrikt!",
			saveFailed: "Misslyckades med att spara inställningar. Försök igen.",
			saveError: "Fel vid sparande av inställningar. Försök igen."
		},
		validation: {
			accountSidRequired: "Konto-SID krävs",
			accountSidInvalid:
				"Konto-SID måste börja med 'AC' och vara 34 tecken långt",
			authTokenRequired: "Autentiseringstoken krävs",
			authTokenInvalid: "Autentiseringstoken måste vara 32 tecken långt",
			phoneNumberRequired: "Telefonnummer krävs",
			phoneNumberInvalid:
				"Telefonnummer måste börja med + och inkludera landskod",
			senderIdTooLong: "Avsändar-ID får vara högst 11 tecken",
			senderIdInvalid: "Avsändar-ID får endast innehålla bokstäver och siffror",
			deepSeekApiKeyRequired: "DeepSeek API-nyckel krävs",
			deepSeekApiKeyInvalid:
				"DeepSeek API-nyckel måste börja med 'sk-' och vara 48 tecken lång"
		},
		help: {
			title: "Så får du dina Twilio-uppgifter:",
			step1: "Logga in på din Twilio-konsol",
			step2:
				"Hitta ditt konto-SID och autentiseringstoken på instrumentpanelen",
			step3: "Köp ett telefonnummer från telefonnummer-sektionen",
			step4:
				"(Valfritt) Konfigurera ett alfanumeriskt avsändar-ID för stödda länder"
		},
		deepSeek: {
			title: "DeepSeek AI-översättning",
			apiKey: "API-nyckel",
			apiKeyDescription:
				"Din DeepSeek API-nyckel för AI-översättningstjänster (håll detta hemligt!)",
			apiKeyPlaceholder: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
			saveSettings: "Spara inställningar",
			saving: "Sparar...",
			saveSuccess: "DeepSeek-inställningar sparade framgångsrikt!",
			saveFailed:
				"Misslyckades med att spara DeepSeek-inställningar. Försök igen.",
			saveError: "Fel vid sparande av DeepSeek-inställningar. Försök igen."
		},
		deepSeekHelp: {
			title: "Hur du får din DeepSeek API-nyckel:",
			step1: "Skapa ett konto på DeepSeek",
			step2: "Gå till API-nyckel-sektionen i din DeepSeek-konsol",
			step3: "Skapa en ny API-nyckel och kopiera den",
			step4: "Klistra in API-nyckeln i inställningarna ovan"
		}
	}
};
