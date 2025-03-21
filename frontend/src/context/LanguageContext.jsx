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
    // Determine the language to use: user language takes precedence over localStorage
    const storedLang = localStorage.getItem('preferredLanguage') || 'en';
    const langToUse = user?.language || storedLang;
    setLanguage(langToUse);
    initializeTranslation(langToUse);
  }, [user]);

  const initializeTranslation = (lang) => {
    if (lang === 'te') {
      // Force reinitialization by removing any existing script
      const oldScript = document.getElementById('google-translate-script');
      if (oldScript) {
        oldScript.remove();
      }

      // Clear previous translation container content
      const container = document.getElementById('google_translate_element');
      if (container) container.innerHTML = '';

      // Create and load the Google Translate script
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      // Define the global callback for Google Translate
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'te,en',
            autoDisplay: false,
          },
          'google_translate_element'
        );

        // Wait briefly for the dropdown to appear, then switch to Telugu
        setTimeout(() => {
          const selectLang = document.querySelector('.goog-te-combo');
          if (selectLang) {
            selectLang.value = 'te';
            selectLang.dispatchEvent(new Event('change'));
          }
        }, 1500);
      };
    } else {
      // Reset to English: remove translation elements and script
      const container = document.getElementById('google_translate_element');
      if (container) container.innerHTML = '';

      const script = document.getElementById('google-translate-script');
      if (script) script.remove();

      const gtFrame = document.querySelector('iframe.goog-te-banner-frame');
      if (gtFrame) gtFrame.style.display = 'none';
    }
  };

  const changeLanguage = async (newLanguage) => {
    localStorage.setItem('preferredLanguage', newLanguage);
    if (user) {
      try {
        await axios.patch(`${API_URL}/api/users/language`, { language: newLanguage });
      } catch (error) {
        console.error('Error updating language', error);
      }
    }
    setLanguage(newLanguage);
    initializeTranslation(newLanguage);
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
