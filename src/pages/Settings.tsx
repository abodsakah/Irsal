import { useState, useEffect } from "react";
import { Save, Eye, EyeOff, Settings as SettingsIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	SettingsService,
	TwilioSettings,
	DeepSeekSettings
} from "../services/SettingsService";

export default function Settings() {
	const { t } = useTranslation();
	const [settings, setSettings] = useState<TwilioSettings>({
		account_sid: "",
		auth_token: "",
		phone_number: "",
		sender_id: ""
	});
	const [deepSeekSettings, setDeepSeekSettings] = useState<DeepSeekSettings>({
		api_key: ""
	});
	const [loading, setLoading] = useState(false);
	const [showAuthToken, setShowAuthToken] = useState(false);
	const [showApiKey, setShowApiKey] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [deepSeekErrors, setDeepSeekErrors] = useState<Record<string, string>>(
		{}
	);
	const [successMessage, setSuccessMessage] = useState("");
	const [deepSeekSuccessMessage, setDeepSeekSuccessMessage] = useState("");

	useEffect(() => {
		loadSettings();
	}, []);

	useEffect(() => {
		// Clear success messages after 3 seconds
		if (successMessage) {
			const timer = setTimeout(() => setSuccessMessage(""), 3000);
			return () => clearTimeout(timer);
		}
	}, [successMessage]);

	useEffect(() => {
		if (deepSeekSuccessMessage) {
			const timer = setTimeout(() => setDeepSeekSuccessMessage(""), 3000);
			return () => clearTimeout(timer);
		}
	}, [deepSeekSuccessMessage]);

	const loadSettings = async () => {
		setLoading(true);
		try {
			const [twilioSettings, deepSeekSettings] = await Promise.all([
				SettingsService.getTwilioSettings(),
				SettingsService.getDeepSeekSettings()
			]);
			setSettings(twilioSettings);
			setDeepSeekSettings(deepSeekSettings);
		} catch (error) {
			console.error("Error loading settings:", error);
		} finally {
			setLoading(false);
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!settings.account_sid.trim()) {
			newErrors.account_sid = t("settings.validation.accountSidRequired");
		} else if (
			!settings.account_sid.startsWith("AC") ||
			settings.account_sid.length !== 34
		) {
			newErrors.account_sid = t("settings.validation.accountSidInvalid");
		}

		if (!settings.auth_token.trim()) {
			newErrors.auth_token = t("settings.validation.authTokenRequired");
		} else if (settings.auth_token.length !== 32) {
			newErrors.auth_token = t("settings.validation.authTokenInvalid");
		}

		if (!settings.phone_number.trim()) {
			newErrors.phone_number = t("settings.validation.phoneNumberRequired");
		} else if (!settings.phone_number.startsWith("+")) {
			newErrors.phone_number = t("settings.validation.phoneNumberInvalid");
		}

		if (settings.sender_id && settings.sender_id.length > 11) {
			newErrors.sender_id = t("settings.validation.senderIdTooLong");
		}

		// Validate sender ID contains only alphanumeric characters
		if (settings.sender_id && !/^[a-zA-Z0-9]*$/.test(settings.sender_id)) {
			newErrors.sender_id = t("settings.validation.senderIdInvalid");
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = async () => {
		if (!validateForm()) {
			return;
		}

		setLoading(true);
		setSuccessMessage("");
		try {
			const success = await SettingsService.saveTwilioSettings(settings);
			if (success) {
				setSuccessMessage(t("settings.twilio.saveSuccess"));
			} else {
				alert(t("settings.twilio.saveFailed"));
			}
		} catch (error) {
			console.error("Error saving settings:", error);
			alert(t("settings.twilio.saveError"));
		} finally {
			setLoading(false);
		}
	};

	const validateDeepSeekForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!deepSeekSettings.api_key.trim()) {
			newErrors.api_key = t("settings.validation.deepSeekApiKeyRequired");
		} else if (deepSeekSettings.api_key.length < 20) {
			newErrors.api_key = t("settings.validation.deepSeekApiKeyInvalid");
		}

		setDeepSeekErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleDeepSeekSave = async () => {
		if (!validateDeepSeekForm()) {
			return;
		}

		setLoading(true);
		setDeepSeekSuccessMessage("");
		try {
			const success = await SettingsService.saveDeepSeekSettings(
				deepSeekSettings
			);
			if (success) {
				setDeepSeekSuccessMessage(t("settings.deepSeek.saveSuccess"));
			} else {
				alert(t("settings.deepSeek.saveFailed"));
			}
		} catch (error) {
			console.error("Error saving DeepSeek settings:", error);
			alert(t("settings.deepSeek.saveError"));
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (field: keyof TwilioSettings, value: string) => {
		setSettings((prev) => ({
			...prev,
			[field]: value
		}));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({
				...prev,
				[field]: ""
			}));
		}
	};

	const handleDeepSeekInputChange = (
		field: keyof DeepSeekSettings,
		value: string
	) => {
		setDeepSeekSettings((prev) => ({
			...prev,
			[field]: value
		}));
		// Clear error when user starts typing
		if (deepSeekErrors[field]) {
			setDeepSeekErrors((prev) => ({
				...prev,
				[field]: ""
			}));
		}
	};

	return (
		<div className='max-w-4xl mx-auto p-6'>
			{/* Header */}
			<div className='flex items-center gap-3 mb-6'>
				<SettingsIcon className='w-8 h-8 text-blue-600' />
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>
						{t("settings.title")}
					</h1>
					<p className='text-gray-600'>{t("settings.subtitle")}</p>
				</div>
			</div>

			{/* Settings Form */}
			<div className='bg-white rounded-lg shadow-md p-6'>
				{successMessage && (
					<div className='mb-4 p-4 bg-green-50 border border-green-200 rounded-md'>
						<p className='text-sm text-green-800'>{successMessage}</p>
					</div>
				)}

				<h2 className='text-xl font-semibold text-gray-900 mb-4'>
					{t("settings.twilio.title")}
				</h2>

				<div className='space-y-6'>
					{/* Account SID */}
					<div>
						<label
							htmlFor='account_sid'
							className='block text-sm font-medium text-gray-700 mb-2'
						>
							{t("settings.twilio.accountSid")} *
						</label>
						<input
							type='text'
							id='account_sid'
							value={settings.account_sid}
							onChange={(e) => handleInputChange("account_sid", e.target.value)}
							className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.account_sid ? "border-red-500" : "border-gray-300"
							}`}
							placeholder={t("settings.twilio.accountSidPlaceholder")}
						/>
						{errors.account_sid && (
							<p className='mt-1 text-sm text-red-600'>{errors.account_sid}</p>
						)}
						<p className='mt-1 text-sm text-gray-500'>
							{t("settings.twilio.accountSidDescription")}
						</p>
					</div>

					{/* Auth Token */}
					<div>
						<label
							htmlFor='auth_token'
							className='block text-sm font-medium text-gray-700 mb-2'
						>
							{t("settings.twilio.authToken")} *
						</label>
						<div className='relative'>
							<input
								type={showAuthToken ? "text" : "password"}
								id='auth_token'
								value={settings.auth_token}
								onChange={(e) =>
									handleInputChange("auth_token", e.target.value)
								}
								className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
									errors.auth_token ? "border-red-500" : "border-gray-300"
								}`}
								placeholder={t("settings.twilio.authTokenPlaceholder")}
							/>
							<button
								type='button'
								onClick={() => setShowAuthToken(!showAuthToken)}
								className='absolute inset-y-0 right-0 pr-3 flex items-center'
							>
								{showAuthToken ? (
									<EyeOff className='h-4 w-4 text-gray-400' />
								) : (
									<Eye className='h-4 w-4 text-gray-400' />
								)}
							</button>
						</div>
						{errors.auth_token && (
							<p className='mt-1 text-sm text-red-600'>{errors.auth_token}</p>
						)}
						<p className='mt-1 text-sm text-gray-500'>
							{t("settings.twilio.authTokenDescription")}
						</p>
					</div>

					{/* Phone Number */}
					<div>
						<label
							htmlFor='phone_number'
							className='block text-sm font-medium text-gray-700 mb-2'
						>
							{t("settings.twilio.phoneNumber")} *
						</label>
						<input
							type='text'
							id='phone_number'
							value={settings.phone_number}
							onChange={(e) =>
								handleInputChange("phone_number", e.target.value)
							}
							className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.phone_number ? "border-red-500" : "border-gray-300"
							}`}
							placeholder={t("settings.twilio.phoneNumberPlaceholder")}
						/>
						{errors.phone_number && (
							<p className='mt-1 text-sm text-red-600'>{errors.phone_number}</p>
						)}
						<p className='mt-1 text-sm text-gray-500'>
							{t("settings.twilio.phoneNumberDescription")}
						</p>
					</div>

					{/* Sender ID */}
					<div>
						<label
							htmlFor='sender_id'
							className='block text-sm font-medium text-gray-700 mb-2'
						>
							{t("settings.twilio.senderId")}
						</label>
						<input
							type='text'
							id='sender_id'
							value={settings.sender_id}
							onChange={(e) => handleInputChange("sender_id", e.target.value)}
							className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.sender_id ? "border-red-500" : "border-gray-300"
							}`}
							placeholder={t("settings.twilio.senderIdPlaceholder")}
							maxLength={11}
						/>
						{errors.sender_id && (
							<p className='mt-1 text-sm text-red-600'>{errors.sender_id}</p>
						)}
						<p className='mt-1 text-sm text-gray-500'>
							{t("settings.twilio.senderIdDescription")}
						</p>
						<p className='mt-1 text-xs text-gray-400'>
							{t("settings.twilio.charactersRemaining", {
								count: 11 - settings.sender_id.length
							})}
						</p>
					</div>
				</div>

				{/* Save Button */}
				<div className='mt-8 flex justify-end'>
					<button
						onClick={handleSave}
						disabled={loading}
						className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{loading ? (
							<>
								<div className='animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full'></div>
								{t("settings.twilio.saving")}
							</>
						) : (
							<>
								<Save className='w-4 h-4 mr-2' />
								{t("settings.twilio.saveSettings")}
							</>
						)}
					</button>
				</div>
			</div>

			{/* DeepSeek AI Translation Settings */}
			<div className='bg-white rounded-lg shadow-md p-6 mt-6'>
				{deepSeekSuccessMessage && (
					<div className='mb-4 p-4 bg-green-50 border border-green-200 rounded-md'>
						<p className='text-sm text-green-800'>{deepSeekSuccessMessage}</p>
					</div>
				)}

				<h2 className='text-xl font-semibold text-gray-900 mb-4'>
					{t("settings.deepSeek.title")}
				</h2>

				<div className='space-y-6'>
					{/* API Key */}
					<div>
						<label
							htmlFor='deepseek_api_key'
							className='block text-sm font-medium text-gray-700 mb-2'
						>
							{t("settings.deepSeek.apiKey")} *
						</label>
						<div className='relative'>
							<input
								type={showApiKey ? "text" : "password"}
								id='deepseek_api_key'
								value={deepSeekSettings.api_key}
								onChange={(e) =>
									handleDeepSeekInputChange("api_key", e.target.value)
								}
								className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
									deepSeekErrors.api_key ? "border-red-500" : "border-gray-300"
								}`}
								placeholder={t("settings.deepSeek.apiKeyPlaceholder")}
							/>
							<button
								type='button'
								onClick={() => setShowApiKey(!showApiKey)}
								className='absolute inset-y-0 right-0 pr-3 flex items-center'
							>
								{showApiKey ? (
									<EyeOff className='h-4 w-4 text-gray-400' />
								) : (
									<Eye className='h-4 w-4 text-gray-400' />
								)}
							</button>
						</div>
						{deepSeekErrors.api_key && (
							<p className='mt-1 text-sm text-red-600'>
								{deepSeekErrors.api_key}
							</p>
						)}
						<p className='mt-1 text-sm text-gray-500'>
							{t("settings.deepSeek.apiKeyDescription")}
						</p>
					</div>
				</div>

				{/* Save Button */}
				<div className='mt-8 flex justify-end'>
					<button
						onClick={handleDeepSeekSave}
						disabled={loading}
						className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{loading ? (
							<>
								<div className='animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full'></div>
								{t("settings.deepSeek.saving")}
							</>
						) : (
							<>
								<Save className='w-4 h-4 mr-2' />
								{t("settings.deepSeek.saveSettings")}
							</>
						)}
					</button>
				</div>
			</div>

			{/* DeepSeek Information Box */}
			<div className='mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4'>
				<h3 className='text-sm font-medium text-purple-900 mb-2'>
					{t("settings.deepSeekHelp.title")}
				</h3>
				<ol className='text-sm text-purple-800 space-y-1'>
					<li>
						1. {t("settings.deepSeekHelp.step1")}{" "}
						<a
							href='https://platform.deepseek.com/'
							target='_blank'
							rel='noopener noreferrer'
							className='underline'
						>
							DeepSeek Platform
						</a>
					</li>
					<li>2. {t("settings.deepSeekHelp.step2")}</li>
					<li>3. {t("settings.deepSeekHelp.step3")}</li>
					<li>4. {t("settings.deepSeekHelp.step4")}</li>
				</ol>
			</div>

			{/* Twilio Information Box */}
			<div className='mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4'>
				<h3 className='text-sm font-medium text-blue-900 mb-2'>
					{t("settings.help.title")}
				</h3>
				<ol className='text-sm text-blue-800 space-y-1'>
					<li>
						1. {t("settings.help.step1")}{" "}
						<a
							href='https://console.twilio.com/'
							target='_blank'
							rel='noopener noreferrer'
							className='underline'
						>
							Twilio Console
						</a>
					</li>
					<li>2. {t("settings.help.step2")}</li>
					<li>3. {t("settings.help.step3")}</li>
					<li>4. {t("settings.help.step4")}</li>
				</ol>
			</div>
		</div>
	);
}
