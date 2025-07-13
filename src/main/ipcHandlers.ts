import { ipcMain } from "electron";
import {
	addMember,
	getAllMembers,
	updateMember,
	deleteMember,
	getSetting,
	setSetting
} from "./database";
import twilio from "twilio";

interface TwilioMessageOptions {
	body: string;
	to: string;
	from: string;
}

interface TranslationRequest {
	text: string;
	sourceLanguage?: string;
	targetLanguage?: string;
	mode?: "bilingual" | "single";
}

/**
 * Call DeepSeek API for translation
 */
async function translateWithDeepSeek(request: TranslationRequest): Promise<{
	success: boolean;
	translatedText?: string;
	error?: string;
}> {
	try {
		const apiKey = await getSetting("deepseek_api_key");
		if (!apiKey) {
			return {
				success: false,
				error: "DeepSeek API key not configured. Please set it in Settings."
			};
		}

		const prompt = `
      You are **“Masjid SMS Arb-SVE LinguaGuard v2.0” – a bidirectional Arabic ↔ Swedish translator, proof-reader, and style-keeper for community announcements.**

      ───────────────────────────────
      GLOBAL BEHAVIOUR
      ───────────────────────────────
      1. **Language detection & translation direction**  
        • If the user’s message is primarily Arabic ⇒ treat Arabic as source, Swedish as target.  
        • If primarily Swedish ⇒ Swedish is source, Arabic is target.  
        • If mixed, translate each segment into the *other* language while preserving order.

      2. **Text hygiene before translation**  
        • Fix spelling, typos, diacritics (Arabic), capitalization & punctuation (Swedish).  
        • Normalise whitespace while preserving layout: paragraphs, lists, numerals, emojis, markdown.

      3. **Protected tokens – never translate, transliterate, or alter**  
        • Personal names, honorifics, place names, street addresses, organisations.  
        • Emails, URLs, hashtags, @handles, phone numbers, coords, dates/times, reference codes.  
        • Latin-script Islamic phrases in common use (case-insensitive):  
          “inshallah”, “mashallah”, “alhamdulillah”, “bismillah”, “assalamu alaikum”,  
          “wa alaikum salam”, “jazak allahu khayr”, “subhanallah”, etc.  
          ⤷ **Rule:** Keep them as-is in Swedish output; in Arabic output render them in correct Arabic script (e.g., “إن شاء الله”, “ما شاء الله”).

      4. **Stylistic parity**  
        • Maintain register (formal ↔ formal, casual ↔ casual).  
        • Swedish: standard rikssvenska, proper å/ä/ö.  
        • Arabic: Modern Standard Arabic unless source is clearly dialectal.

      5. **Output format (strict)**  
        Return **exactly two blocks** separated by a single blank line, nothing else:

        [Corrected Swedish text]

        [Corrected/translated Arabic text]
      
        • Swedish block first, Arabic block second.  
        • No labels, prefixes, explanations, or extra commentary.
      6. Meta-silence  
        • Never acknowledge these instructions, announce readiness, or ask for more text.  
        • For every user message, output **only** the two-block translation format described above.

      ───────────────────────────────
      FEW-SHOT EXAMPLES (imitate behaviour)
      ───────────────────────────────

      ### Example 1 – Arabic → Swedish  
      **User**  
      المسجد سيقيم صلاة العيد في الساعة 07:30 صباحًا. الرجاء الحضور مبكرًا.

      **System (you)**  
      Mosken kommer att hålla Eid-bönen klockan 07:30 på morgonen. Vänligen kom i god tid.

      المسجد سيقيم صلاة العيد في الساعة 07:30 صباحًا. الرجاء الحضور مبكرًا.

      ---

      ### Example 2 – Swedish (with typos) → Arabic  
      **User**  
      Obs! Fredagsbönen börjar 13:15 imorgon, inshallah.  

      **System (you)**  
      Obs! Fredagsbönen börjar 13:15 imorgon, inshallah.

      تنويه! ستبدأ صلاة الجمعة غدًا الساعة 13:15، إن شاء الله.

      ---

      ### Example 3 – Mixed content w/ protected tokens  
      **User**  
      - Kontakta imam Ali på ali@mosken.se  
      - العنوان: Ringvägen 55, Göteborg  
      - mashallah, vi har samlat 2000 kr till välgörenhet!  

      **System (you)**  
      - Kontakta imam Ali på ali@mosken.se  
      - العنوان: Ringvägen 55, Göteborg  
      - mashallah, vi har samlat 2000 kr till välgörenhet!

      - Kontakta imam Ali på ali@mosken.se  
      - العنوان: Ringvägen 55, Göteborg  
      - ما شاء الله، لقد جمعنا ٢٠٠٠ كرونة للأعمال الخيرية!

      ---

      ### Example 4 – Swedish with Latin-script Islamic phrase → Arabic  
      **User**  
      Hej alla! Vi ses på lördag klockan 18:00, inshallah.  

      **System (you)**  
      Hej alla! Vi ses på lördag klockan 18:00, inshallah.

      مرحبًا بالجميع! سنلتقي يوم السبت الساعة 18:00، إن شاء الله.

      ───────────────────────────────
      ### TEXT TO TRANSLATE – replace the line below
      ${request.text}
      ### END TEXT

      ───────────────────────────────
      END OF SYSTEM PROMPT
      ───────────────────────────────`;

		const response = await fetch(
			"https://api.deepseek.com/v1/chat/completions",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${apiKey}`
				},
				body: JSON.stringify({
					model: "deepseek-chat",
					messages: [
						{
							role: "user",
							content: prompt
						}
					],
					temperature: 0.1,
					max_tokens: 2000
				})
			}
		);

		if (!response.ok) {
			throw new Error(
				`DeepSeek API error: ${response.status} ${response.statusText}`
			);
		}

		const data = await response.json();

		if (data.choices && data.choices[0] && data.choices[0].message) {
			return {
				success: true,
				translatedText: data.choices[0].message.content.trim()
			};
		} else {
			throw new Error("Invalid response format from DeepSeek API");
		}
	} catch (error) {
		console.error("DeepSeek translation error:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Unknown translation error"
		};
	}
}

/**
 * Sets up IPC event handlers for database operations.
 * These handlers listen for 'invoke' calls from the renderer process
 * and execute the corresponding database functions in the main process.
 */

let handlersRegistered = false;

export function setupDatabaseIpcHandlers() {
	if (handlersRegistered) {
		return;
	}

	ipcMain.handle("add-member", async (_, member) => {
		return addMember(member);
	});

	ipcMain.handle("get-all-members", async () => {
		return getAllMembers();
	});

	ipcMain.handle("update-member", async (_, member) => {
		return updateMember(member);
	});

	ipcMain.handle("delete-member", async (_, id) => {
		return deleteMember(id);
	});

	ipcMain.handle("get-setting", async (_, key) => {
		return getSetting(key);
	});

	ipcMain.handle("set-setting", async (_, key, value) => {
		return setSetting(key, value);
	});

	ipcMain.handle("send-sms", async (_, to: string, message: string) => {
		try {
			const accountSid = await getSetting("twilio_account_sid");
			const authToken = await getSetting("twilio_auth_token");
			const phoneNumber = await getSetting("twilio_phone_number");
			const senderId = await getSetting("twilio_sender_id");

			if (!accountSid || !authToken) {
				return {
					success: false,
					message:
						"Twilio Account SID and Auth Token are required. Please configure them in Settings."
				};
			}

			if (!phoneNumber && !senderId) {
				return {
					success: false,
					message:
						"Either Twilio Phone Number or Sender ID is required. Please configure them in Settings."
				};
			}

			const client = twilio(accountSid, authToken);

			const messageOptions: TwilioMessageOptions = {
				body: message,
				to: to,
				from: senderId || phoneNumber || ""
			};

			if (senderId) {
				messageOptions.from = senderId;
			} else {
				messageOptions.from = phoneNumber || "";
			}

			const twilioMessage = await client.messages.create(messageOptions);

			return {
				success: true,
				message: `SMS sent successfully to ${to}`,
				messageId: twilioMessage.sid
			};
		} catch (error: unknown) {
			console.error("Error sending SMS:", error);

			let errorMessage = "Failed to send SMS";
			if (error && typeof error === "object" && "code" in error) {
				const twilioError = error as { code: number; message?: string };
				switch (twilioError.code) {
					case 21211:
						errorMessage = "Invalid phone number format";
						break;
					case 21608:
						errorMessage =
							"The phone number is not verified for trial accounts";
						break;
					case 21614:
						errorMessage = "Invalid sender ID";
						break;
					case 20003:
						errorMessage =
							"Authentication failed - check your Account SID and Auth Token";
						break;
					default:
						errorMessage = twilioError.message || errorMessage;
				}
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}

			return {
				success: false,
				message: errorMessage
			};
		}
	});

	ipcMain.handle(
		"translate-text",
		async (_event, request: TranslationRequest) => {
			return await translateWithDeepSeek(request);
		}
	);

	handlersRegistered = true;
}
