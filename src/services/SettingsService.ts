/**
 * SettingsService - Handles Twilio and application settings via IPC
 * This service communicates with the main process to store/retrieve settings
 * from the SQLite database.
 */

export interface TwilioSettings {
	account_sid: string;
	auth_token: string;
	phone_number: string;
	sender_id: string;
}

export interface DeepSeekSettings {
	api_key: string;
}

class SettingsServiceImpl {
	/**
	 * Retrieves a specific setting value from the database.
	 * @param key - The key of the setting to retrieve (e.g., 'twilio_account_sid').
	 * @returns A Promise that resolves with the setting's value as a string, or null if not found.
	 */
	async get(key: string): Promise<string | null> {
		try {
			const value = await window.ipcRenderer.getSetting(key);
			return value;
		} catch (error) {
			console.error(`Error in SettingsService.get for key "${key}":`, error);
			return null;
		}
	}

	/**
	 * Sets or updates a setting's value in the database.
	 * If the key exists, its value is updated; otherwise, a new setting is inserted.
	 * @param key - The key of the setting.
	 * @param value - The value to set for the setting.
	 * @returns A Promise that resolves to true if the setting was saved/updated, false otherwise.
	 */
	async set(key: string, value: string): Promise<boolean> {
		try {
			const success = await window.ipcRenderer.setSetting(key, value);
			return success;
		} catch (error) {
			console.error(`Error in SettingsService.set for key "${key}":`, error);
			return false;
		}
	}

	/**
	 * Retrieves all Twilio settings
	 * @returns TwilioSettings object with current values
	 */
	async getTwilioSettings(): Promise<TwilioSettings> {
		try {
			const [account_sid, auth_token, phone_number, sender_id] =
				await Promise.all([
					this.get("twilio_account_sid"),
					this.get("twilio_auth_token"),
					this.get("twilio_phone_number"),
					this.get("twilio_sender_id")
				]);

			return {
				account_sid: account_sid || "",
				auth_token: auth_token || "",
				phone_number: phone_number || "",
				sender_id: sender_id || ""
			};
		} catch (error) {
			console.error("Error getting Twilio settings:", error);
			return {
				account_sid: "",
				auth_token: "",
				phone_number: "",
				sender_id: ""
			};
		}
	}

	/**
	 * Saves all Twilio settings
	 * @param settings - The TwilioSettings object to save
	 * @returns True if all settings were saved successfully
	 */
	async saveTwilioSettings(settings: TwilioSettings): Promise<boolean> {
		try {
			const results = await Promise.all([
				this.set("twilio_account_sid", settings.account_sid),
				this.set("twilio_auth_token", settings.auth_token),
				this.set("twilio_phone_number", settings.phone_number),
				this.set("twilio_sender_id", settings.sender_id)
			]);

			return results.every((result) => result === true);
		} catch (error) {
			console.error("Error saving Twilio settings:", error);
			return false;
		}
	}

	/**
	 * Retrieves DeepSeek settings
	 * @returns DeepSeekSettings object with current values
	 */
	async getDeepSeekSettings(): Promise<DeepSeekSettings> {
		try {
			const api_key = await this.get("deepseek_api_key");

			return {
				api_key: api_key || ""
			};
		} catch (error) {
			console.error("Error getting DeepSeek settings:", error);
			return {
				api_key: ""
			};
		}
	}

	/**
	 * Saves DeepSeek settings
	 * @param settings - The DeepSeekSettings object to save
	 * @returns True if all settings were saved successfully
	 */
	async saveDeepSeekSettings(settings: DeepSeekSettings): Promise<boolean> {
		try {
			const result = await this.set("deepseek_api_key", settings.api_key);
			return result;
		} catch (error) {
			console.error("Error saving DeepSeek settings:", error);
			return false;
		}
	}
}

export const SettingsService = new SettingsServiceImpl();
