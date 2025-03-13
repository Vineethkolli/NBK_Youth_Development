// src/components/auth/LanguageToggle.jsx
import { Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

function LanguageToggle() {
  const { language, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'te' : 'en';
    changeLanguage(newLanguage);
    // Store language preference in localStorage
    localStorage.setItem('preferredLanguage', newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="absolute top-4 right-4 flex items-center px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
    >
      <Languages className="h-4 w-4 mr-2" />
      {language === 'en' ? 'తెలుగు' : 'English'}
    </button>
  );
}

export default LanguageToggle;
