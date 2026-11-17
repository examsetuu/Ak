import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ExamList } from './components/ExamList';
import { ExamDetailModal } from './components/ExamDetailModal';
import { ProcessGuideModal } from './components/ProcessGuideModal';
import { StudentTools } from './components/tools/StudentTools';
import { GoogleSheetSyncModal } from './components/GoogleSheetSyncModal';
import { LegalModal } from './components/LegalModal';
import { Footer } from './components/Footer';
import { ExamChatbot } from './components/ExamChatbot';
import { INITIAL_EXAMS } from './data/exams';
import { ExamItem, ExamCategory, QualificationLevel, Language, ProcessType, LegalPage } from './types/exam';
import { TRANSLATIONS } from './data/translations';
import {
  ShieldCheck,
  Lock,
  Zap,
  CheckCircle2,
  GraduationCap,
  Languages,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [exams, setExams] = useState<ExamItem[]>(INITIAL_EXAMS);
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory>('All');
  const [selectedQualification, setSelectedQualification] = useState<QualificationLevel>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExamForModal, setSelectedExamForModal] = useState<ExamItem | null>(null);

  // Language state (English / Hindi)
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('examsetu_lang');
      return saved === 'hi' || saved === 'en' ? (saved as Language) : 'en';
    } catch {
      return 'en';
    }
  });

  // Process guide modal state
  const [guideExam, setGuideExam] = useState<ExamItem | null>(null);
  const [guideProcess, setGuideProcess] = useState<ProcessType | null>(null);

  // Sheet sync modal
  const [isSheetSyncOpen, setIsSheetSyncOpen] = useState(false);

  // Legal modal state (About Us, Contact Us, Privacy Policy, Disclaimer)
  const [legalPage, setLegalPage] = useState<LegalPage | null>(null);

  // AI Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pendingChatPrompt, setPendingChatPrompt] = useState<string | null>(null);

  // Bookmarks
  const [bookmarkedExams, setBookmarkedExams] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('examsetu_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('examsetu_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('examsetu_lang', language);
    } catch {}
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem('examsetu_bookmarks', JSON.stringify(bookmarkedExams));
    } catch {}
  }, [bookmarkedExams]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('examsetu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('examsetu_theme', 'light');
    }
  }, [darkMode]);

  const toggleBookmark = (examName: string) => {
    setBookmarkedExams((prev) =>
      prev.includes(examName) ? prev.filter((n) => n !== examName) : [...prev, examName]
    );
  };

  const handleOpenProcessGuide = (exam: ExamItem, process: ProcessType) => {
    setGuideExam(exam);
    setGuideProcess(process);
  };

  const handleAskAIForExam = (exam: ExamItem) => {
    const prompt =
      language === 'hi'
        ? `${exam.n} (${exam.o}) की नवीनतम आधिकारिक परीक्षा तिथि, एडमिट कार्ड, उत्तर कुंजी या रिजल्ट स्थिति Google Search से जांचकर बताएं।`
        : `Check the latest official exam status, application/exam dates, admit card, answer key, or result updates for ${exam.n} (${exam.o}) via Google Search.`;
    setPendingChatPrompt(prompt);
    setIsChatOpen(true);
  };

  const scrollToTools = () => {
    const el = document.getElementById('form-tools');
    if (!el) return;
    const header = document.querySelector('header');
    const headerHeight = header ? header.getBoundingClientRect().height : 72;
    const targetTop = el.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    });
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen w-full max-w-full box-border overflow-x-clip flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <Header
        language={language}
        onToggleLanguage={toggleLanguage}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenSheetSync={() => setIsSheetSyncOpen(true)}
        onScrollToTools={scrollToTools}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full min-w-0 mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-8 box-border">
        {/* Aspirant Feature Highlight Bar */}
        <div className="w-full max-w-full min-w-0 box-border p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-300/80 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-rose-950 flex items-center justify-center font-black shrink-0 shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                  {language === 'hi' ? 'विशेष सुविधाएं' : 'Aspirant Spotlight'}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                  {language === 'hi' ? '10वीं / 12वीं / स्नातक' : '10th / 12th / Graduate'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-0.5 break-words">
                {language === 'hi'
                  ? 'अपनी शैक्षिक योग्यता ("10वीं पास", "12वीं पास", "ग्रेजुएट") अनुसार सभी एसएससी, रेलवे, रक्षा व राज्य स्तरीय भर्तियां तुरंत देखें। ताजा अपडेट के लिए AI सहायक का उपयोग करें।'
                  : 'Filter exams instantly by your qualification ("10th Pass", "12th Pass", "Graduate") across SSC, Railway, Defence & State boards. Use Ask AI for live Google Search updates.'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0 max-w-full">
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-rose-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'hi' ? 'AI लाइव सर्च' : 'Ask AI'}</span>
            </button>
            <button
              onClick={toggleLanguage}
              className="px-3.5 py-2 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-sm cursor-pointer"
            >
              <Languages className="w-4 h-4 text-amber-300" />
              <span>{language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}</span>
            </button>
          </div>
        </div>

        {/* Value Proposition Pills / Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 text-xs w-full max-w-full">
          <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 sm:gap-2.5 min-w-0 box-border">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-slate-900 dark:text-white block truncate">
                {language === 'hi' ? 'सत्यापित पोर्टल' : 'Official Links'}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
                {language === 'hi' ? 'सीधे सरकारी लिंक' : 'Direct government portals'}
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 sm:gap-2.5 min-w-0 box-border">
            <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-slate-900 dark:text-white block truncate">
                {language === 'hi' ? '100% निजी टूल्स' : '100% Private Tools'}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
                {language === 'hi' ? 'ब्राउज़र में प्रोसेसिंग' : 'No photos saved on server'}
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 sm:gap-2.5 min-w-0 box-border">
            <Zap className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-slate-900 dark:text-white block truncate">
                {language === 'hi' ? 'तेज़ व ऑफलाइन' : 'Fast & Offline Ready'}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
                {language === 'hi' ? 'बिना इंटरनेट लोड' : 'Instant client canvas'}
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 sm:gap-2.5 min-w-0 box-border">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-slate-900 dark:text-white block truncate">
                {language === 'hi' ? 'द्विभाषी हिंदी/Eng' : 'Bilingual EN/HI'}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
                {language === 'hi' ? 'पूर्ण हिंदी अनुवाद' : '1-click instant switch'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Choose Your Exam Directory with Qualification and Category Filters */}
        <ExamList
          exams={exams}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedQualification={selectedQualification}
          onSelectQualification={setSelectedQualification}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelectExam={(exam) => setSelectedExamForModal(exam)}
          onOpenProcessGuide={handleOpenProcessGuide}
          bookmarkedExams={bookmarkedExams}
          onToggleBookmark={toggleBookmark}
          onlyBookmarked={onlyBookmarked}
          onToggleOnlyBookmarked={() => setOnlyBookmarked(!onlyBookmarked)}
          language={language}
        />

        {/* Section 2: Student Form Tools (Resizer, Age, PDF) */}
        <StudentTools language={language} />
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onSelectQualification={(q) => setSelectedQualification(q)}
        onOpenLegalPage={(page) => setLegalPage(page)}
      />

      {/* Floating AI Assistant Launcher */}
      {!isChatOpen && (
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 right-3 sm:bottom-5 sm:right-5 z-40 max-w-[calc(100vw-1.5rem)] px-4 py-3 rounded-full bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 hover:from-rose-900 hover:to-rose-800 text-amber-300 border-2 border-amber-500 shadow-xl flex items-center gap-2 text-xs sm:text-sm font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Open ExamSetu & Toolkit AI Assistant"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{language === 'hi' ? 'AI सहायक' : 'Ask Exam AI'}</span>
        </button>
      )}

      {/* Modals */}
      <ExamDetailModal
        exam={selectedExamForModal}
        isOpen={!!selectedExamForModal}
        onClose={() => setSelectedExamForModal(null)}
        onOpenProcessGuide={handleOpenProcessGuide}
        onAskAI={handleAskAIForExam}
        isBookmarked={
          selectedExamForModal ? bookmarkedExams.includes(selectedExamForModal.n) : false
        }
        onToggleBookmark={toggleBookmark}
        language={language}
      />

      <ProcessGuideModal
        exam={guideExam}
        processType={guideProcess}
        onClose={() => {
          setGuideExam(null);
          setGuideProcess(null);
        }}
        language={language}
      />

      <GoogleSheetSyncModal
        isOpen={isSheetSyncOpen}
        onClose={() => setIsSheetSyncOpen(false)}
        onSyncExams={(newExams) => setExams(newExams)}
      />

      {/* AdSense-Compliant Legal Pages Modal */}
      <LegalModal
        isOpen={!!legalPage}
        activePage={legalPage}
        onClose={() => setLegalPage(null)}
        onSelectPage={(page) => setLegalPage(page)}
        language={language}
      />

      {/* Multi-turn Gemini AI Exam Chatbot with Google Search Grounding */}
      <ExamChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        language={language}
        pendingPrompt={pendingChatPrompt}
        onClearPendingPrompt={() => setPendingChatPrompt(null)}
      />
    </div>
  );
}
