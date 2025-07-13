import { ipcMain } from "electron";
import {
	addMember,
	getAllMembers,
	updateMember,
	deleteMember,
	getSetting,
	setSetting
} from "./database"; // Adjust path if your database.ts is in a different location relative to this file
import twilio from "twilio";

interface TwilioMessageOptions {
	body: string;
	to: string;
	from: string;
}

/**
 * Sets up IPC event handlers for database operations.
 * These handlers listen for 'invoke' calls from the renderer process
 * and execute the corresponding database functions in the main process.
 */

let handlersRegistered = false;

export function setupDatabaseIpcHandlers() {
	// Prevent duplicate handler registration
	if (handlersRegistered) {
		return;
	}

	// Member Management Handlers
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

	// Settings Management Handlers
	ipcMain.handle("get-setting", async (_, key) => {
		return getSetting(key);
	});

	ipcMain.handle("set-setting", async (_, key, value) => {
		return setSetting(key, value);
	});

	// Twilio SMS handler
	ipcMain.handle("send-sms", async (_, to: string, message: string) => {
		try {
			// Get Twilio settings from database
			const accountSid = await getSetting("twilio_account_sid");
			const authToken = await getSetting("twilio_auth_token");
			const phoneNumber = await getSetting("twilio_phone_number");
			const senderId = await getSetting("twilio_sender_id");

			// Validate Twilio configuration
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

			// Initialize Twilio client
			const client = twilio(accountSid, authToken);

			// Prepare message options
			const messageOptions: TwilioMessageOptions = {
				body: message,
				to: to,
				from: senderId || phoneNumber || ""
			};

			// Use sender ID if configured, otherwise use phone number
			if (senderId) {
				messageOptions.from = senderId;
			} else {
				messageOptions.from = phoneNumber || "";
			}

			// Send SMS
			const twilioMessage = await client.messages.create(messageOptions);

			return {
				success: true,
				message: `SMS sent successfully to ${to}`,
				messageId: twilioMessage.sid
			};
		} catch (error: unknown) {
			console.error("Error sending SMS:", error);

			// Handle common Twilio errors
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

	// Mark handlers as registered
	handlersRegistered = true;
}
