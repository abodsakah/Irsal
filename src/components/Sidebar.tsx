import {
	CircleChevronLeft,
	CircleChevronRight,
	Home,
	Users,
	Settings,
	MessageCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const MENU_ITEMS = [
	{ label: "sidebar.home", href: "/", icon: Home, emoji: "🏠" },
	{ label: "sidebar.members", href: "/members", icon: Users, emoji: "👥" },
	{ label: "sidebar.settings", href: "/settings", icon: Settings, emoji: "⚙️" }
];

export default function Sidebar() {
	const [isCollapsed, setIsCollapsed] = useState(() => {
		// Load collapsed state from localStorage
		const saved = localStorage.getItem("sidebar-collapsed");
		return saved ? JSON.parse(saved) : false;
	});
	const location = useLocation();
	const { t, i18n } = useTranslation();

	// Save collapsed state to localStorage
	useEffect(() => {
		localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
	}, [isCollapsed]);

	function toggleSidebar() {
		setIsCollapsed(!isCollapsed);
	}

	return (
		<div className='relative'>
			{/* Sidebar */}
			<div
				className={`flex flex-col h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-xl border-r border-gray-700 transition-all duration-300 ease-in-out ${
					isCollapsed ? "w-20" : "w-64"
				}`}
			>
				{/* Header */}
				<div className='p-4 border-b border-gray-700'>
					<div
						className={`flex items-center ${
							isCollapsed ? "justify-center" : "justify-between"
						}`}
					>
						<div className='flex gap-2 items-center'>
							<MessageCircle className='text-blue-400' />
							{!isCollapsed && (
								<h1 className='text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
									{t("app.title")}
								</h1>
							)}
						</div>

						{/* Toggle Button */}
						<button
							className='p-1.5 rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0'
							onClick={toggleSidebar}
							aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
							title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
						>
							{isCollapsed ? (
								i18n.language === "ar" ? (
									<CircleChevronLeft className='text-gray-400 hover:text-white w-5 h-5 transition-colors' />
								) : (
									<CircleChevronRight className='text-gray-400 hover:text-white w-5 h-5 transition-colors' />
								)
							) : i18n.language === "ar" ? (
								<CircleChevronRight className='text-gray-400 hover:text-white w-5 h-5 transition-colors' />
							) : (
								<CircleChevronLeft className='text-gray-400 hover:text-white w-5 h-5 transition-colors' />
							)}
						</button>
					</div>
				</div>

				{/* Navigation */}
				<nav className='flex flex-col py-4 flex-1 space-y-1 px-2'>
					{MENU_ITEMS.map((item) => {
						const isActive = location.pathname === item.href;
						const IconComponent = item.icon;

						return (
							<Link
								key={item.href}
								to={item.href}
								className={`group relative flex items-center p-3 rounded-lg transition-all duration-200 ${
									isActive
										? "bg-blue-600 text-white shadow-lg"
										: "hover:bg-gray-700 text-gray-300 hover:text-white"
								} ${isCollapsed ? "justify-center" : ""}`}
								title={isCollapsed ? t(item.label) : undefined}
							>
								{/* Icon */}
								<IconComponent
									className={`flex-shrink-0 transition-all duration-200 ${
										isCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3"
									} ${
										isActive
											? "text-white"
											: "text-gray-400 group-hover:text-white"
									}`}
								/>

								{/* Label */}
								{!isCollapsed && (
									<span
										className={`transition-all duration-200 ${
											isActive ? "font-medium" : "font-normal"
										}`}
									>
										{t(item.label)}
									</span>
								)}

								{/* Active indicator */}
								{isActive && (
									<div className='absolute right-2 w-2 h-2 bg-white rounded-full opacity-75'></div>
								)}

								{/* Tooltip for collapsed state */}
								{isCollapsed && (
									<div className='absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30'>
										{t(item.label)}
										<div className='absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full'>
											<div className='w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900'></div>
										</div>
									</div>
								)}
							</Link>
						);
					})}
				</nav>

				{/* Language Switcher */}
				<div className='mt-auto p-4 border-t border-gray-700'>
					<LanguageSwitcher collapsed={isCollapsed} />
				</div>

				{/* Footer */}
				{!isCollapsed && (
					<div className='p-4 border-t border-gray-700'>
						<div className='text-xs text-gray-500 text-center'>
							<div className='flex items-center justify-center space-x-1'>
								<span>Built with</span>
								<span className='text-red-500'>♥</span>
								<span>by Irsal Team</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
