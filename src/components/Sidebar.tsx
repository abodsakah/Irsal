import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import React, { useState } from "react";

// type Props = {}

interface MenuItem {
	label: string;
	href: string;
	emoji: string;
}

const MENU_ITEMS = [
	{ label: "Home", href: "/", emoji: "🏠" },
	{ label: "Contacts", href: "/contacts", emoji: "👥" },
	{ label: "Settings", href: "/settings", emoji: "⚙️" }
];

export default function Sidebar() {
	const [navbarCollapsed, setNavbarCollapsed] = useState(false);

	function toggleNavbar() {
		setNavbarCollapsed(!navbarCollapsed);
	}

	return (
		<>
			<button
				className={`absolute top-2 bg-gray-700 p-1 rounded-full shadow-2xs ${
					navbarCollapsed ? "left-14" : "left-60"
				} transition-all duration-300`}
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
					Irsal
				</h1>
				<nav className='flex flex-col space-y-2'>
					{MENU_ITEMS.map((item) => (
						<a
							key={item.href}
							href={item.href}
							className='flex items-center p-2 rounded hover:bg-gray-700 transition-colors'
						>
							<span
								className={`mr-2 ${
									navbarCollapsed ? "text-2xl" : "text-md"
								} transition-all duration-300`}
							>
								{item.emoji}
							</span>
							{!navbarCollapsed && <span>{item.label}</span>}
						</a>
					))}
				</nav>
			</div>
		</>
	);
}
