import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('vylash_lang') || 'th';
    });

    useEffect(() => {
        localStorage.setItem('vylash_lang', language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => (prev === 'th' ? 'en' : 'th'));
    };

    const t = translations[language] || translations.th;

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
