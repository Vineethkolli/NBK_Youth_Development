import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/config';
import { useAuth } from './AuthContext';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const { user } = useAuth();
  const [language, setLanguage] = useState(() => {
    // initial value from localStorage or default to 'en'
    return localStorage.getItem('preferredLanguage') || 'en';
  });

  // Always fetch the user language from the DB if logged in
  useEffect(() => {
    async function fetchUserLanguage() {
      try {
        const response = await axios.get(`${API_URL}/api/users/language`);
        if (response.data && response.data.language) {
          setLanguage(response.data.language);
          localStorage.setItem('preferredLanguage', response.data.language);
          initializeTranslation(response.data.language);
        } else {
          initializeTranslation(language);
        }
      } catch (error) {
        console.error('Failed to fetch language preference from DB:', error);
        // fallback to using the current language from state/localStorage
        initializeTranslation(language);
      }
    }

    if (user) {
      fetchUserLanguage();
    } else {
      // For non-logged in users, use the localStorage value
      initializeTranslation(language);
    }
  }, [user]);

  const initializeTranslation = (lang) => {
    if (lang === 'te') {
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'te',
            autoDisplay: false,
          },
          'google_translate_element'
        );

        const observer = new MutationObserver(() => {
          const selectLang = document.querySelector('.goog-te-combo');
          if (selectLang) {
            selectLang.value = 'te';
            selectLang.dispatchEvent(new Event('change'));
            observer.disconnect();
          }
        });

        observer.observe(document.body, { childList: true, subtree: true });
      };
    } else {
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
        console.error('Failed to update language preference:', error);
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
