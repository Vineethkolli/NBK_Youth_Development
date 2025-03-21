import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/config';
import { useAuth } from './AuthContext';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const { user } = useAuth();
  const [language, setLanguage] = useState(() => {
    // Initial read from localStorage
    return localStorage.getItem('preferredLanguage') || 'en';
  });

  useEffect(() => {
    console.log('LanguageContext useEffect triggered. user.language:', user?.language);

    if (user?.language) {
      // If user object is available and has a language field
      setLanguage(user.language);
      localStorage.setItem('preferredLanguage', user.language);
      initializeTranslation(user.language);
    } else {
      // Otherwise, fallback to whatever is in localStorage
      const storedLang = localStorage.getItem('preferredLanguage') || 'en';
      setLanguage(storedLang);
      initializeTranslation(storedLang);
    }
  }, [user]);

  const initializeTranslation = (lang) => {
    if (lang === 'te') {
      // Load Google Translate script if not already present
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }

      // Define the global callback for Google Translate
      window.googleTranslateElementInit = () => {
        console.log('googleTranslateElementInit called for Telugu!');
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            // Optional: include English too so the user can manually switch back
            includedLanguages: 'te,en',
            autoDisplay: false,
          },
          'google_translate_element'
        );

        // Instead of a MutationObserver, wait briefly for the dropdown to appear
        setTimeout(() => {
          const selectLang = document.querySelector('.goog-te-combo');
          console.log('setTimeout approach. Found .goog-te-combo:', selectLang);
          if (selectLang) {
            selectLang.value = 'te';
            selectLang.dispatchEvent(new Event('change'));
          }
        }, 1500);
      };
    } else {
      // Reset to English: remove script, container, and banner
      const container = document.getElementById('google_translate_element');
      if (container) container.innerHTML = '';

      const script = document.getElementById('google-translate-script');
      if (script) script.remove();

      const gtFrame = document.querySelector('iframe.goog-te-banner-frame');
      if (gtFrame) gtFrame.style.display = 'none';
    }
  };

  const changeLanguage = async (newLanguage) => {
    console.log('changeLanguage called with:', newLanguage);

    // Always update localStorage
    localStorage.setItem('preferredLanguage', newLanguage);

    // Update the language in the backend if the user is authenticated
    if (user) {
      try {
        await axios.patch(`${API_URL}/api/users/language`, {
          language: newLanguage,
        });
      } catch (error) {
        console.error('Failed to update language preference:', error);
      }
    }

    // Update local state and re-initialize translation
    setLanguage(newLanguage);
    initializeTranslation(newLanguage);

    // Optionally reload if switching to English to clear Google Translate artifacts
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
