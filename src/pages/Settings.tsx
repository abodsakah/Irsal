import { useState, useEffect } from "react";
import { Save, Eye, EyeOff, Settings as SettingsIcon } from "lucide-react";
import { SettingsService, TwilioSettings } from "../services/SettingsService";

export default function Settings() {
	const [settings, setSettings] = useState<TwilioSettings>({
		account_sid: "",
		auth_token: "",
		phone_number: "",
		sender_id: ""
	});
	const [loading, setLoading] = useState(false);
	const [showAuthToken, setShowAuthToken] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		loadSettings();
	}, []);

	useEffect(() => {
		// Clear success message after 3 seconds
		if (successMessage) {
			const timer = setTimeout(() => setSuccessMessage(""), 3000);
			return () => clearTimeout(timer);
		}
	}, [successMessage]);

	const loadSettings = async () => {
		setLoading(true);
		try {
			const twilioSettings = await SettingsService.getTwilioSettings();
			setSettings(twilioSettings);
		} catch (error) {
			console.error("Error loading settings:", error);
		} finally {
			setLoading(false);
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!settings.account_sid.trim()) {
			newErrors.account_sid = "Account SID is required";
		} else if (
			!settings.account_sid.startsWith("AC") ||
			settings.account_sid.length !== 34
		) {
			newErrors.account_sid =
				"Account SID must start with 'AC' and be 34 characters long";
		}

		if (!settings.auth_token.trim()) {
			newErrors.auth_token = "Auth Token is required";
		} else if (settings.auth_token.length !== 32) {
			newErrors.auth_token = "Auth Token must be 32 characters long";
		}

		if (!settings.phone_number.trim()) {
			newErrors.phone_number = "Phone Number is required";
		} else if (!settings.phone_number.startsWith("+")) {
			newErrors.phone_number =
				"Phone number must start with + and include country code";
		}

		if (settings.sender_id && settings.sender_id.length > 11) {
			newErrors.sender_id = "Sender ID must be 11 characters or less";
		}

		// Validate sender ID contains only alphanumeric characters
		if (settings.sender_id && !/^[a-zA-Z0-9]*$/.test(settings.sender_id)) {
			newErrors.sender_id = "Sender ID must contain only letters and numbers";
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
				setSuccessMessage("Settings saved successfully!");
			} else {
				alert("Failed to save settings. Please try again.");
			}
		} catch (error) {
			console.error("Error saving settings:", error);
			alert("Error saving settings. Please try again.");
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

	return (
		<div className='max-w-4xl mx-auto p-6'>
			{/* Header */}
			<div className='flex items-center gap-3 mb-6'>
				<SettingsIcon className='w-8 h-8 text-blue-600' />
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>Settings</h1>
					<p className='text-gray-600'>Configure your Twilio SMS settings</p>
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
					Twilio Configuration
				</h2>

				<div className='space-y-6'>
					{/* Account SID */}
					<div>
						<label
							htmlFor='account_sid'
							className='block text-sm font-medium text-gray-700 mb-2'
						>
							Account SID *
						</label>
						<input
							type='text'
							id='account_sid'
							value={settings.account_sid}
							onChange={(e) => handleInputChange("account_sid", e.target.value)}
							className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.account_sid ? "border-red-500" : "border-gray-300"
							}`}
							placeholder='ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
						/>
						{errors.account_sid && (
							<p className='mt-1 text-sm text-red-600'>{errors.account_sid}</p>
						)}
						<p className='mt-1 text-sm text-gray-500'>
							Your Twilio Account SID (34 characters, starts with "AC")
						</p>
					</div>

					{/* Auth Token */}
					<div>
						<label
							htmlFor='auth_token'
							className='block text-sm font-medium text-gray-700 mb-2'
						>
							Auth Token *
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
								placeholder='32-character auth token'
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
							Your Twilio Auth Token (32 characters, keep this secret!)
						</p>
					</div>

					{/* Phone Number */}
					<div>
						<label
							htmlFor='phone_number'
							className='block text-sm font-medium text-gray-700 mb-2'
						>
							Twilio Phone Number *
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
							placeholder='+1234567890'
						/>
						{errors.phone_number && (
							<p className='mt-1 text-sm text-red-600'>{errors.phone_number}</p>
						)}
						<p className='mt-1 text-sm text-gray-500'>
							The phone number you purchased from Twilio (including country
							code)
						</p>
					</div>

					{/* Sender ID */}
					<div>
						<label
							htmlFor='sender_id'
							className='block text-sm font-medium text-gray-700 mb-2'
						>
							Alphanumeric Sender ID
						</label>
						<input
							type='text'
							id='sender_id'
							value={settings.sender_id}
							onChange={(e) => handleInputChange("sender_id", e.target.value)}
							className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.sender_id ? "border-red-500" : "border-gray-300"
							}`}
							placeholder='MOSQUE'
							maxLength={11}
						/>
						{errors.sender_id && (
							<p className='mt-1 text-sm text-red-600'>{errors.sender_id}</p>
						)}
						<p className='mt-1 text-sm text-gray-500'>
							Optional. Custom sender name (max 11 characters, letters and
							numbers only). Leave empty to use your Twilio phone number.
						</p>
						<p className='mt-1 text-xs text-gray-400'>
							Characters remaining: {11 - settings.sender_id.length}
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
								Saving...
							</>
						) : (
							<>
								<Save className='w-4 h-4 mr-2' />
								Save Settings
							</>
						)}
					</button>
				</div>
			</div>

			{/* Information Box */}
			<div className='mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4'>
				<h3 className='text-sm font-medium text-blue-900 mb-2'>
					How to get your Twilio credentials:
				</h3>
				<ol className='text-sm text-blue-800 space-y-1'>
					<li>
						1. Log in to your{" "}
						<a
							href='https://console.twilio.com/'
							target='_blank'
							rel='noopener noreferrer'
							className='underline'
						>
							Twilio Console
						</a>
					</li>
					<li>2. Find your Account SID and Auth Token on the dashboard</li>
					<li>3. Purchase a phone number from the Phone Numbers section</li>
					<li>
						4. (Optional) Set up an Alphanumeric Sender ID for supported
						countries
					</li>
				</ol>
			</div>
		</div>
	);
}
