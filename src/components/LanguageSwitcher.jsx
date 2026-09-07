import React from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith("es") ? "en" : "es";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-600 shadow-sm hover:text-slate-900 hover:bg-slate-50 transition-colors"
      aria-label="Cambiar idioma / Switch language"
    >
      <Languages className="w-4 h-4" />
      {i18n.language.startsWith("es") ? "EN" : "ES"}
    </button>
  );
};

export default LanguageSwitcher;
