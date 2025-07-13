import { useState, useEffect } from "react";
import {
	Users,
	MessageSquare,
	Send,
	BarChart3,
	X,
	CheckCircle,
	AlertCircle,
	Loader2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { MemberService } from "../services/MembersService";
import {
	CampaignService,
	CampaignStats,
	SendCampaignResult
} from "../services/CampaignService";

// Import Member type from MembersService
type Member = {
	id?: number;
	first_name: string;
	last_name: string;
	city?: string;
	phone_number: string;
	created_at?: string;
};

export default function Home() {
	const { t } = useTranslation();
	const [stats, setStats] = useState<CampaignStats>({
		totalMembers: 0,
		recentCampaigns: 0,
		totalMessagesSent: 0
	});
	const [members, setMembers] = useState<Member[]>([]);
	const [loading, setLoading] = useState(true);
	const [showCampaignModal, setShowCampaignModal] = useState(false);
	const [campaignMessage, setCampaignMessage] = useState("");
	const [sendingCampaign, setSendingCampaign] = useState(false);
	const [campaignResult, setCampaignResult] =
		useState<SendCampaignResult | null>(null);

	useEffect(() => {
		loadDashboardData();
	}, []);

	const loadDashboardData = async () => {
		setLoading(true);
		try {
			const [campaignStats, membersList] = await Promise.all([
				CampaignService.getCampaignStats(),
				MemberService.getAll()
			]);
			setStats(campaignStats);
			setMembers(membersList);
		} catch (error) {
			console.error("Error loading dashboard data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSendCampaign = async () => {
		if (!campaignMessage.trim()) {
			alert(t("home.modal.enterMessage"));
			return;
		}

		if (members.length === 0) {
			alert(t("home.modal.noMembers"));
			return;
		}

		const confirmSend = window.confirm(
			t("home.modal.confirmSend", { count: members.length })
		);

		if (!confirmSend) {
			return;
		}

		setSendingCampaign(true);
		setCampaignResult(null);

		try {
			const recipients = members.map((member) => member.phone_number);
			const result = await CampaignService.sendCampaign({
				message: campaignMessage,
				recipients
			});

			setCampaignResult(result);

			if (result.success) {
				// Reload stats after successful campaign
				await loadDashboardData();
			}
		} catch (error) {
			console.error("Error sending campaign:", error);
			setCampaignResult({
				success: false,
				message: "Failed to send campaign: " + error
			});
		} finally {
			setSendingCampaign(false);
		}
	};

	const resetCampaignModal = () => {
		setShowCampaignModal(false);
		setCampaignMessage("");
		setCampaignResult(null);
		setSendingCampaign(false);
	};

	const messageLength = campaignMessage.length;
	const smsCount = Math.ceil(messageLength / 160) || 1;

	return (
		<div className='max-w-6xl mx-auto p-6'>
			{/* Header */}
			<div className='flex items-center justify-between mb-8'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>
						{t("home.title")}
					</h1>
					<p className='text-gray-600'>{t("home.subtitle")}</p>
				</div>
				<button
					onClick={() => setShowCampaignModal(true)}
					className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
				>
					<Send className='w-4 h-4 mr-2' />
					{t("home.sendCampaign")}
				</button>
			</div>

			{/* Stats Cards */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
				{/* Total Members */}
				<div className='bg-white rounded-lg shadow-md p-6'>
					<div className='flex items-center'>
						<div className='flex-shrink-0'>
							<Users className='h-8 w-8 text-blue-600' />
						</div>
						<div className='ml-5 w-0 flex-1'>
							<dl>
								<dt className='text-sm font-medium text-gray-500 truncate'>
									{t("home.stats.totalMembers")}
								</dt>
								<dd className='text-3xl font-semibold text-gray-900'>
									{loading ? "..." : stats.totalMembers}
								</dd>
							</dl>
						</div>
					</div>
				</div>

				{/* Recent Campaigns */}
				<div className='bg-white rounded-lg shadow-md p-6'>
					<div className='flex items-center'>
						<div className='flex-shrink-0'>
							<BarChart3 className='h-8 w-8 text-green-600' />
						</div>
						<div className='ml-5 w-0 flex-1'>
							<dl>
								<dt className='text-sm font-medium text-gray-500 truncate'>
									{t("home.stats.recentCampaigns")}
								</dt>
								<dd className='text-3xl font-semibold text-gray-900'>
									{loading ? "..." : stats.recentCampaigns}
								</dd>
							</dl>
						</div>
					</div>
				</div>

				{/* Messages Sent */}
				<div className='bg-white rounded-lg shadow-md p-6'>
					<div className='flex items-center'>
						<div className='flex-shrink-0'>
							<MessageSquare className='h-8 w-8 text-purple-600' />
						</div>
						<div className='ml-5 w-0 flex-1'>
							<dl>
								<dt className='text-sm font-medium text-gray-500 truncate'>
									{t("home.stats.messagesSent")}
								</dt>
								<dd className='text-3xl font-semibold text-gray-900'>
									{loading ? "..." : stats.totalMessagesSent}
								</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>

			{/* Recent Activity */}
			<div className='bg-white rounded-lg shadow-md p-6'>
				<h2 className='text-xl font-semibold text-gray-900 mb-4'>
					{t("home.recentMembers")}
				</h2>
				{loading ? (
					<div className='flex items-center justify-center py-8'>
						<Loader2 className='h-6 w-6 animate-spin text-gray-400' />
						<span className='ml-2 text-gray-500'>{t("common.loading")}</span>
					</div>
				) : members.length === 0 ? (
					<div className='text-center py-8'>
						<Users className='h-12 w-12 text-gray-400 mx-auto mb-4' />
						<p className='text-gray-500'>{t("home.noMembers")}</p>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										{t("members.table.name")}
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										{t("members.table.city")}
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										{t("members.table.phone")}
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										{t("members.table.added")}
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{members.slice(0, 5).map((member) => (
									<tr key={member.id}>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
											{member.first_name} {member.last_name}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{member.city || "—"}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{member.phone_number}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{member.created_at
												? new Date(member.created_at).toLocaleDateString()
												: "—"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{members.length > 5 && (
							<div className='mt-4 text-center'>
								<p className='text-sm text-gray-500'>
									{t("home.showingMembers", {
										count: 5,
										total: members.length
									})}
								</p>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Campaign Modal */}
			{showCampaignModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
					<div className='relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white'>
						{/* Modal Header */}
						<div className='flex items-center justify-between mb-4'>
							<h3 className='text-lg font-semibold text-gray-900'>
								{t("home.modal.title")}
							</h3>
							<button
								onClick={resetCampaignModal}
								className='text-gray-400 hover:text-gray-600'
							>
								<X className='h-6 w-6' />
							</button>
						</div>

						{/* Campaign Result */}
						{campaignResult && (
							<div
								className={`mb-4 p-4 rounded-md ${
									campaignResult.success
										? "bg-green-50 border border-green-200"
										: "bg-red-50 border border-red-200"
								}`}
							>
								<div className='flex'>
									{campaignResult.success ? (
										<CheckCircle className='h-5 w-5 text-green-400' />
									) : (
										<AlertCircle className='h-5 w-5 text-red-400' />
									)}
									<div className='ml-3'>
										<p
											className={`text-sm ${
												campaignResult.success
													? "text-green-800"
													: "text-red-800"
											}`}
										>
											{campaignResult.message}
										</p>
										{campaignResult.errors &&
											campaignResult.errors.length > 0 && (
												<details className='mt-2'>
													<summary className='cursor-pointer text-sm font-medium'>
														{t("home.modal.viewErrors", {
															count: campaignResult.errors.length
														})}
													</summary>
													<ul className='mt-2 text-xs space-y-1'>
														{campaignResult.errors
															.slice(0, 5)
															.map((error, index) => (
																<li key={index} className='text-red-700'>
																	{error}
																</li>
															))}
													</ul>
												</details>
											)}
									</div>
								</div>
							</div>
						)}

						{/* Recipients Info */}
						<div className='mb-4 p-3 bg-blue-50 rounded-md'>
							<p className='text-sm text-blue-800'>
								{t("home.modal.recipients", { count: members.length })}
							</p>
						</div>

						{/* Message Input */}
						<div className='mb-4'>
							<label
								htmlFor='campaign-message'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								{t("home.modal.message")}
							</label>
							<textarea
								id='campaign-message'
								rows={4}
								value={campaignMessage}
								onChange={(e) => setCampaignMessage(e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
								placeholder={t("home.modal.messagePlaceholder")}
								disabled={sendingCampaign}
							/>
							<div className='flex justify-between mt-2'>
								<p className='text-sm text-gray-500'>
									{smsCount === 1
										? t("home.modal.characterCount", {
												count: messageLength,
												sms: smsCount
										  })
										: t("home.modal.characterCountPlural", {
												count: messageLength,
												sms: smsCount
										  })}
								</p>
								<p
									className={`text-sm ${
										messageLength > 160 ? "text-orange-600" : "text-gray-500"
									}`}
								>
									{t("home.modal.charsUntilNext", {
										count: 160 - (messageLength % 160)
									})}
								</p>
							</div>
						</div>

						{/* Modal Actions */}
						<div className='flex items-center justify-end space-x-3'>
							<button
								onClick={resetCampaignModal}
								disabled={sendingCampaign}
								className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
							>
								{t("common.cancel")}
							</button>
							<button
								onClick={handleSendCampaign}
								disabled={
									sendingCampaign ||
									!campaignMessage.trim() ||
									members.length === 0
								}
								className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								{sendingCampaign ? (
									<>
										<Loader2 className='animate-spin -ml-1 mr-2 h-4 w-4' />
										{t("home.modal.sending")}
									</>
								) : (
									<>
										<Send className='w-4 h-4 mr-2' />
										{t("home.modal.sendToMembers", { count: members.length })}
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
