import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const MENU_ITEMS = [
	{ label: "sidebar.home", href: "/", emoji: "🏠" },
	{ label: "sidebar.members", href: "/members", emoji: "👥" },
	{ label: "sidebar.settings", href: "/settings", emoji: "⚙️" }
];

export default function Sidebar() {
	const [navbarCollapsed, setNavbarCollapsed] = useState(false);
	const location = useLocation();
	const { t } = useTranslation();

	function toggleNavbar() {
		setNavbarCollapsed(!navbarCollapsed);
	}

	return (
		<>
			<button
				className={`absolute top-2 bg-gray-700 p-1 rounded-full shadow-2xs ${
					navbarCollapsed ? "left-14" : "left-60"
				} transition-all duration-300 z-10`}
				onClick={toggleNavbar}
			>
				{navbarCollapsed ? (
					<CircleChevronRight className='text-white' />
				) : (
					<CircleChevronLeft className='text-white' />
				)}
			</button>
			<div
				className={`flex flex-col h-full bg-gray-800 text-white p-4 ${
					navbarCollapsed ? "w-18" : "w-64"
				} transition-width duration-300`}
			>
				<h1
					className={` font-bold mb-4 ${
						navbarCollapsed ? "text-sm" : "text-2xl"
					} transition-all duration-300`}
				>
					{t('app.title')}
				</h1>
				<nav className='flex flex-col space-y-2 flex-1'>
					{MENU_ITEMS.map((item) => {
						const isActive = location.pathname === item.href;
						return (
							<Link
								key={item.href}
								to={item.href}
								className={`flex items-center p-2 rounded transition-colors ${
									isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
								}`}
							>
								<span
									className={`mr-2 ${
										navbarCollapsed ? "text-2xl" : "text-md"
									} transition-all duration-300`}
								>
									{item.emoji}
								</span>
								{!navbarCollapsed && <span>{t(item.label)}</span>}
							</Link>
						);
					})}
				</nav>
				
				{/* Language Switcher */}
				<div className="mt-auto pt-4 border-t border-gray-700">
					<LanguageSwitcher collapsed={navbarCollapsed} />
				</div>
			</div>
		</>
	);
}
