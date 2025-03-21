import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/config';
import { useAuth } from './AuthContext';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const { user } = useAuth();
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('preferredLanguage') || 'en';
  });

  useEffect(() => {
    // When the auth user changes (login/profile loaded), use the language from user data or local storage
    if (user?.language) {
      setLanguage(user.language);
      localStorage.setItem('preferredLanguage', user.language);
      initializeTranslation(user.language);
    } else {
      const storedLang = localStorage.getItem('preferredLanguage') || 'en';
      setLanguage(storedLang);
      initializeTranslation(storedLang);
    }
  }, [user]);

  // This function handles the loading (or unload) of Google Translate
  const initializeTranslation = (lang) => {
    if (lang === 'te') {
      // Remove any existing Google Translate instances
      const oldScript = document.getElementById('google-translate-script');
      if (oldScript) {
        oldScript.remove();
      }
      const container = document.getElementById('google_translate_element');
      if (container) {
        container.innerHTML = '';
      }
      const gtFrame = document.querySelector('iframe.goog-te-banner-frame');
      if (gtFrame) {
        gtFrame.style.display = 'none';
      }

      // Inject the Google Translate script fresh
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      // Define the global callback used by Google Translate once the script loads
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'te,en',
            autoDisplay: false,
          },
          'google_translate_element'
        );

        // Shortly after initialization, automatically change the translation option to Telugu
        setTimeout(() => {
          const selectLang = document.querySelector('.goog-te-combo');
          if (selectLang) {
            selectLang.value = 'te';
            selectLang.dispatchEvent(new Event('change'));
          }
        }, 1500); // delay to allow dropdown to populate
      };
    } else {
      // If the language is set to English, remove the Google Translate elements (if any)
      const container = document.getElementById('google_translate_element');
      if (container) container.innerHTML = '';
      const script = document.getElementById('google-translate-script');
      if (script) script.remove();
      const gtFrame = document.querySelector('iframe.goog-te-banner-frame');
      if (gtFrame) gtFrame.style.display = 'none';
    }
  };

  // Call this function when the user explicitly changes the language
  const changeLanguage = async (newLanguage) => {
    localStorage.setItem('preferredLanguage', newLanguage);
    if (user) {
      try {
        // Update on the server, if needed
        await axios.patch(`${API_URL}/api/users/language`, { language: newLanguage });
      } catch (error) {
        console.error('Language update error:', error);
      }
    }
    setLanguage(newLanguage);
    initializeTranslation(newLanguage);
    // For a clean state when switching back to English, reload the page
    if (newLanguage === 'en') {
      window.location.reload();
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;