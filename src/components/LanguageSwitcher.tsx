import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const languages = [
	{ code: "en", name: "English", flag: "🇺🇸" },
	{ code: "sv", name: "Svenska", flag: "🇸🇪" },
	{ code: "ar", name: "العربية", flag: "🇸🇦" }
];

interface LanguageSwitcherProps {
	collapsed?: boolean;
}

export default function LanguageSwitcher({
	collapsed = false
}: LanguageSwitcherProps) {
	const { i18n } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">(
		"bottom"
	);
	const [dropdownHorizontal, setDropdownHorizontal] = useState<
		"left" | "right"
	>("left");
	const dropdownRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const currentLanguage =
		languages.find((lang) => lang.code === i18n.language) || languages[0];

	// Calculate dropdown position based on available space
	useEffect(() => {
		if (isOpen && buttonRef.current) {
			const buttonRect = buttonRef.current.getBoundingClientRect();
			const dropdownHeight = 150; // Approximate height of dropdown
			const dropdownWidth = 200; // Approximate width of dropdown

			// Calculate vertical position
			const spaceBelow = window.innerHeight - buttonRect.bottom;
			const spaceAbove = buttonRect.top;

			if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
				setDropdownPosition("top");
			} else {
				setDropdownPosition("bottom");
			}

			// Calculate horizontal position - special handling for collapsed sidebar in RTL
			if (collapsed) {
				const spaceRight = window.innerWidth - buttonRect.right;
				const isRTL = i18n.language === "ar";

				// In RTL mode with collapsed sidebar, position dropdown to the left of the button
				if (isRTL && spaceRight < dropdownWidth) {
					setDropdownHorizontal("right"); // This will make it appear to the left of the button
				} else {
					setDropdownHorizontal("left"); // Normal position (to the right of the button)
				}
			} else {
				// For expanded sidebar, use normal logic
				const spaceRight = window.innerWidth - buttonRect.left;
				const spaceLeft = buttonRect.right;

				if (spaceRight < dropdownWidth && spaceLeft > dropdownWidth) {
					setDropdownHorizontal("right");
				} else {
					setDropdownHorizontal("left");
				}
			}
		}
	}, [isOpen, collapsed, i18n.language]);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleLanguageChange = (languageCode: string) => {
		i18n.changeLanguage(languageCode);
		setIsOpen(false);

		// Update document direction for RTL languages
		document.documentElement.dir = languageCode === "ar" ? "rtl" : "ltr";
		document.documentElement.lang = languageCode;
	};

	return (
		<div className='relative' ref={dropdownRef}>
			<button
				ref={buttonRef}
				onClick={() => setIsOpen(!isOpen)}
				className={`group relative flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-gray-700 text-gray-300 hover:text-white w-full ${
					collapsed ? "justify-center" : ""
				}`}
				title={collapsed ? "Change Language" : undefined}
			>
				<Globe
					className={`flex-shrink-0 transition-all duration-200 ${
						collapsed ? "w-6 h-6" : "w-5 h-5 mr-3"
					} text-gray-400 group-hover:text-white`}
				/>

				{!collapsed && (
					<div className='flex items-center'>
						<span className='mr-2 text-lg'>{currentLanguage.flag}</span>
						<span className='text-sm font-medium'>{currentLanguage.name}</span>
					</div>
				)}

				{/* Tooltip for collapsed state */}
				{collapsed && (
					<div className='absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30'>
						Change Language
						<div className='absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full'>
							<div className='w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900'></div>
						</div>
					</div>
				)}
			</button>

			{/* Dropdown */}
			{isOpen && (
				<>
					{/* Backdrop for mobile */}
					<div
						className='fixed inset-0 z-30'
						onClick={() => setIsOpen(false)}
					></div>

					<div
						className={`absolute z-40 ${
							collapsed
								? dropdownHorizontal === "right"
									? "right-full mr-2 bottom-0" // Position to the left of the button
									: "left-full ml-2 bottom-0" // Position to the right of the button
								: dropdownPosition === "top"
								? dropdownHorizontal === "right"
									? "right-0 bottom-full mb-1"
									: "left-0 bottom-full mb-1"
								: dropdownHorizontal === "right"
								? "right-0 top-full mt-1"
								: "left-0 top-full mt-1"
						} bg-gray-700 rounded-lg shadow-xl border border-gray-600 min-w-max overflow-hidden`}
					>
						{languages.map((language) => (
							<button
								key={language.code}
								onClick={() => handleLanguageChange(language.code)}
								className={`flex items-center px-4 py-3 text-sm hover:bg-gray-600 transition-colors w-full text-left ${
									currentLanguage.code === language.code
										? "bg-gray-600 text-white"
										: "text-gray-300 hover:text-white"
								}`}
							>
								<span className='mr-3 text-lg'>{language.flag}</span>
								<span className='font-medium'>{language.name}</span>
								{currentLanguage.code === language.code && (
									<div className='ml-auto w-2 h-2 bg-blue-500 rounded-full'></div>
								)}
							</button>
						))}
					</div>
				</>
			)}
		</div>
	);
}
