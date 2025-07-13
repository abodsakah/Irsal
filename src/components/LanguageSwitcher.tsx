import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useState } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

interface LanguageSwitcherProps {
  collapsed?: boolean;
}

export default function LanguageSwitcher({ collapsed = false }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    
    // Update document direction for RTL languages
    document.documentElement.dir = languageCode === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = languageCode;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center p-2 rounded transition-colors hover:bg-gray-700 w-full ${
          collapsed ? 'justify-center' : ''
        }`}
        title={collapsed ? 'Change Language' : undefined}
      >
        <Globe className={`${collapsed ? 'text-2xl' : 'text-md'} transition-all duration-300`} />
        {!collapsed && (
          <>
            <span className="ml-2 flex items-center">
              <span className="mr-1">{currentLanguage.flag}</span>
              <span className="text-sm">{currentLanguage.name}</span>
            </span>
          </>
        )}
      </button>

      {isOpen && (
        <div className={`absolute ${
          collapsed ? 'left-full ml-2' : 'left-0'
        } bottom-0 bg-gray-700 rounded-md shadow-lg border border-gray-600 z-50 min-w-max`}>
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`flex items-center px-3 py-2 text-sm hover:bg-gray-600 first:rounded-t-md last:rounded-b-md w-full text-left ${
                currentLanguage.code === language.code ? 'bg-gray-600' : ''
              }`}
            >
              <span className="mr-2">{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
