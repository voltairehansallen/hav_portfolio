'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LANG_KEY = 'hav-os-lang';

const dictionaries = {
  fr: {
    nav: { about: 'about', skills: 'skills', projects: 'projects', journey: 'journey', contact: 'contact' },
    hero: {
      viewProjects: 'voir_les_projets',
      contact: 'me_contacter',
      downloadCv: 'Télécharger mon CV',
    },
  },
  en: {
    nav: { about: 'about', skills: 'skills', projects: 'projects', journey: 'journey', contact: 'contact' },
    hero: {
      viewProjects: 'view_projects',
      contact: 'contact_me',
      downloadCv: 'Download my CV',
    },
  },
};

const LanguageContext = createContext({
  lang: 'fr',
  t: dictionaries.fr,
  toggleLang: () => {},
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('fr');

  useEffect(() => {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === 'fr' || stored === 'en') setLang(stored);
  }, []);

  const toggleLang = () => {
    const next = lang === 'fr' ? 'en' : 'fr';
    setLang(next);
    localStorage.setItem(LANG_KEY, next);
  };

  return (
    <LanguageContext.Provider value={{ lang, t: dictionaries[lang], toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
