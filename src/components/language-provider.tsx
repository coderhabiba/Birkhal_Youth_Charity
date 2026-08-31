"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "bn" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("bn");
  
  // Load initial language from localStorage if available
  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLang = prev === "bn" ? "en" : "bn";
      localStorage.setItem("language", newLang);
      
      // We set a data attribute on the html tag to easily target font styles globally via CSS if needed
      document.documentElement.setAttribute('data-lang', newLang);
      
      return newLang;
    });
  };

  // Initially set the attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-lang', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      <div className={language === 'bn' ? 'font-bn' : 'font-en'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
