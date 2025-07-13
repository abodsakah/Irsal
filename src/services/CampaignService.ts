/**
 * CampaignService - Handles SMS campaign functionality via IPC
 * This service communicates with the main process to send SMS messages
 * using Twilio through the configured settings.
 */

export interface CampaignStats {
	totalMembers: number;
	recentCampaigns: number;
	totalMessagesSent: number;
}

export interface SendCampaignRequest {
	message: string;
	recipients: string[];
}

export interface SendCampaignResult {
	success: boolean;
	message: string;
	successCount?: number;
	errorCount?: number;
	errors?: string[];
}

class CampaignServiceImpl {
	/**
	 * Sends an SMS campaign to multiple recipients
	 * @param request - The campaign request with message and recipients
	 * @returns Result of the campaign send operation
	 */
	async sendCampaign(
		request: SendCampaignRequest
	): Promise<SendCampaignResult> {
		try {
			let successCount = 0;
			let errorCount = 0;
			const errors: string[] = [];

			for (const phoneNumber of request.recipients) {
				try {
					const result = await window.ipcRenderer.sendSms(
						phoneNumber,
						request.message
					);
					if (result.success) {
						successCount++;
					} else {
						errorCount++;
						errors.push(`Failed to send to ${phoneNumber}: ${result.message}`);
					}
				} catch (error) {
					errorCount++;
					errors.push(`Error sending to ${phoneNumber}: ${error}`);
				}
			}

			return {
				success: successCount > 0,
				message: `Campaign completed: ${successCount} sent, ${errorCount} failed`,
				successCount,
				errorCount,
				errors: errors.length > 0 ? errors : undefined
			};
		} catch (error) {
			console.error("Error sending campaign:", error);
			return {
				success: false,
				message: "Failed to send campaign: " + error
			};
		}
	}

	/**
	 * Sends a test SMS to verify Twilio configuration
	 * @param phoneNumber - Test phone number
	 * @param message - Test message
	 * @returns Result of the test send
	 */
	async sendTestSMS(
		phoneNumber: string,
		message: string
	): Promise<SendCampaignResult> {
		try {
			const result = await window.ipcRenderer.sendSms(phoneNumber, message);
			return {
				success: result.success,
				message: result.message || "SMS sent",
				successCount: result.success ? 1 : 0,
				errorCount: result.success ? 0 : 1
			};
		} catch (error) {
			console.error("Error sending test SMS:", error);
			return {
				success: false,
				message: "Failed to send test SMS: " + error
			};
		}
	}

	/**
	 * Gets campaign statistics
	 * @returns Campaign statistics
	 */
	async getCampaignStats(): Promise<CampaignStats> {
		try {
			const members = await window.ipcRenderer.getAllMembers();

			return {
				totalMembers: members.length,
				recentCampaigns: 0,
				totalMessagesSent: 0
			};
		} catch (error) {
			console.error("Error getting campaign stats:", error);
			return {
				totalMembers: 0,
				recentCampaigns: 0,
				totalMessagesSent: 0
			};
		}
	}
}

export const CampaignService = new CampaignServiceImpl();
