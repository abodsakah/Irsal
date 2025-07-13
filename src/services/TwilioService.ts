class TwilioServiceImpl {
	/**
	 * Sends an SMS message to a specified recipient.
	 * @param to - The recipient's phone number (e.g., '+1234567890').
	 * @param message - The text content of the SMS message.
	 * @returns A Promise that resolves with a success status and an optional message.
	 */
	async sendSms(
		to: string,
		message: string
	): Promise<{ success: boolean; message?: string }> {
		try {
			const result = await window.ipcRenderer.sendSms(to, message);
			if (result.success) {
				console.log(`SMS sent successfully to ${to}.`);
			} else {
				console.error(`Failed to send SMS to ${to}:`, result.message);
			}
			return result;
		} catch (error) {
			console.error("Error in TwilioService.sendSms:", error);
			return {
				success: false,
				message: "An unexpected error occurred while sending SMS."
			};
		}
	}
}

export const TwilioService = new TwilioServiceImpl();
