import React from 'react';
import { Moon, Sun, TableProperties, Languages, Sparkles } from 'lucide-react';
import { Language } from '../types/exam';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSheetSync: () => void;
  onScrollToTools: () => void;
  onOpenChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  darkMode,
  onToggleDarkMode,
  onOpenSheetSync,
  onScrollToTools,
  onOpenChat,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="w-full max-w-full box-border overflow-x-hidden bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white border-b-4 border-amber-500 shadow-md sticky top-0 z-40">
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4 box-border">
        {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (Clean Nav Links) — Zone 3 (Language + Theme) */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6 min-w-0 w-full">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 max-w-full">
              <a
                href="#"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500 flex items-center justify-center font-black text-rose-950 text-xs sm:text-sm shadow-sm shrink-0 hover:bg-amber-400 transition-colors"
                aria-label="ExamSetu Home"
              >
                ET
              </a>
              <div className="flex flex-col min-w-0">
                <div className="flex items-baseline gap-0.5 sm:gap-1 min-w-0">
                  <a
                    href="#"
                    className="text-[15px] sm:text-xl font-black tracking-tight text-white hover:text-amber-200 transition-colors shrink-0"
                  >
                    Exam<span className="text-amber-400">Setu</span>
                  </a>
                  <button
                    type="button"
                    onClick={onScrollToTools}
                    className="text-xs sm:text-base font-bold text-amber-200 hover:text-amber-100 hover:bg-amber-400/20 active:bg-amber-400/30 active:scale-95 px-1 sm:px-1.5 py-0.5 rounded-md underline decoration-amber-400/40 underline-offset-4 hover:decoration-amber-200 transition-all cursor-pointer truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    title={
                      language === 'hi'
                        ? 'स्टूडेंट टूलकिट (फोटो रीसाइज़र, PDF व आयु कैलकुलेटर) पर जाएं'
                        : 'Scroll to Student Toolkit (Photo Resizer, PDF Converter & Age Calculator)'
                    }
                    aria-label={
                      language === 'hi'
                        ? 'स्टूडेंट टूलकिट अनुभाग पर स्क्रॉल करें'
                        : 'Jump to Student Toolkit section'
                    }
                  >
                    &amp; Toolkit
                  </button>
                </div>
                <span className="text-[10px] sm:text-xs text-rose-200/90 -mt-0.5 font-medium tracking-wide truncate">
                  {t.tagline}
                </span>
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 text-sm font-medium text-rose-100 shrink-0">
            <a
              href="#exams-list"
              className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
            >
              {t.allExams}
            </a>
            <button
              onClick={onScrollToTools}
              className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.resizerTool}
            </button>
            <button
              onClick={onScrollToTools}
              className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.ageCalcTool}
            </button>
            <button
              onClick={onScrollToTools}
              className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.pdfTool}
            </button>
            <button
              onClick={onOpenSheetSync}
              className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer text-amber-200"
              title="Sync live exam notifications from Google Sheet"
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>{t.sheetSync}</span>
            </button>
          </nav>

          {/* Zone 3: AI Chat + Language Toggle + Dark Mode */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={onOpenChat}
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-rose-950 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs active:scale-95 shrink-0"
              title={language === 'en' ? 'Ask AI Exam Assistant (Live Search)' : 'AI परीक्षा सहायक (लाइव सर्च)'}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{language === 'en' ? 'Ask AI' : 'AI सहायक'}</span>
            </button>

            {/* 1-Click Language Switcher (हिंदी / English) */}
            <button
              onClick={onToggleLanguage}
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 hover:text-white border border-amber-400/40 transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer active:scale-95 shrink-0"
              title={language === 'en' ? 'हिंदी में पढ़ें' : 'Switch to English'}
              aria-label="Toggle language between English and Hindi"
            >
              <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-amber-400/20 text-amber-200 ml-0.5 hidden sm:inline">
                {language === 'en' ? 'HI' : 'EN'}
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 sm:p-2 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              aria-label="Toggle theme"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
