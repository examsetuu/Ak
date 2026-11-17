import React from 'react';
import { ArrowUp, ShieldAlert, GraduationCap, Mail, Phone, ExternalLink } from 'lucide-react';
import { Language, QualificationLevel, LegalPage } from '../types/exam';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  language: Language;
  onSelectQualification?: (qual: QualificationLevel) => void;
  onOpenLegalPage: (page: LegalPage) => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onSelectQualification,
  onOpenLegalPage,
}) => {
  const t = TRANSLATIONS[language];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQualClick = (q: QualificationLevel) => {
    if (onSelectQualification) {
      onSelectQualification(q);
    }
    const el = document.getElementById('exams-list');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 w-full max-w-full box-border overflow-x-hidden bg-slate-900 text-slate-400 border-t-4 border-amber-500">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 box-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800 text-xs sm:text-sm min-w-0">
          {/* Col 1: About & Contact Quick Info */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-lg font-black tracking-tight text-white">
                Exam<span className="text-amber-400">Setu</span>{' '}
                <span className="text-base sm:text-lg font-black text-amber-200">&amp; Toolkit</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                {t.verifiedBadge}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-3">
              {language === 'hi'
                ? 'हर सरकारी परीक्षा की आधिकारिक अधिसूचना, सीधा लिंक, पाठ्यक्रम और फोटो-दस्तावेज टूल्स एक ही स्थान पर। बिना किसी भ्रामक विज्ञापन या फर्जी लिंक के।'
                : 'Every government exam notification, direct link, syllabus, and document tool in one clean, trustworthy destination. No clickbait, no spam popups.'}
            </p>
            <div className="space-y-1 text-xs text-slate-400 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a
                  href="mailto:anishrazzanishrazz789@gmail.com"
                  className="hover:text-amber-300 transition-colors break-all"
                >
                  anishrazzanishrazz789@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/917070385665"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors"
                >
                  WhatsApp: +91 7070385665 (Anish Kumar)
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Official Portals */}
          <div>
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-2.5">
              {language === 'hi' ? 'सत्यापित आधिकारिक पोर्टल' : 'Verified Official Portals'}
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <a
                  href="https://upsc.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors"
                >
                  UPSC (Union Public Service Commission)
                </a>
              </li>
              <li>
                <a
                  href="https://ssc.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors"
                >
                  SSC (Staff Selection Commission)
                </a>
              </li>
              <li>
                <a
                  href="https://www.ibps.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors"
                >
                  IBPS (Banking Personnel Selection)
                </a>
              </li>
              <li>
                <a
                  href="https://www.rrbapply.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors"
                >
                  RRB (Railway Recruitment Boards)
                </a>
              </li>
              <li>
                <a
                  href="https://nta.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors"
                >
                  NTA (National Testing Agency)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Filter by Qualification Shortcuts */}
          <div>
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>
                {language === 'hi' ? 'योग्यता अनुसार भर्तियां' : 'Jobs by Qualification'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              {language === 'hi'
                ? 'अपनी शैक्षिक योग्यता के अनुसार सभी उपलब्ध सरकारी नौकरियां एक क्लिक में देखें:'
                : 'Instantly view all eligible central and state vacancies by your education level:'}
            </p>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => handleQualClick('10th')}
                className="w-full text-left py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-amber-300 text-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>{language === 'hi' ? '10वीं पास भर्तियां (MTS, Group D, GD)' : '10th Pass Jobs (MTS, Group D, GD)'}</span>
                <span className="text-[10px] text-amber-400 font-mono">10th</span>
              </button>
              <button
                onClick={() => handleQualClick('12th')}
                className="w-full text-left py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-amber-300 text-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>{language === 'hi' ? '12वीं पास भर्तियां (CHSL, NDA, NTPC)' : '12th Pass Jobs (CHSL, NDA, NTPC)'}</span>
                <span className="text-[10px] text-amber-400 font-mono">12th</span>
              </button>
              <button
                onClick={() => handleQualClick('Graduate')}
                className="w-full text-left py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-amber-300 text-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>{language === 'hi' ? 'स्नातक / ग्रेजुएट भर्तियां (CGL, IAS, PO)' : 'Graduate Jobs (CGL, IAS, PO)'}</span>
                <span className="text-[10px] text-amber-400 font-mono">Grad</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 AdSense-Compliant Legal Navigation Links */}
        <div className="py-4 border-b border-slate-800/80 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => onOpenLegalPage('about')}
            className="text-slate-300 hover:text-amber-400 transition-colors cursor-pointer py-1"
          >
            {language === 'hi' ? 'हमारे बारे में (About Us)' : 'About Us'}
          </button>
          <span className="text-slate-700 hidden sm:inline">·</span>
          <button
            onClick={() => onOpenLegalPage('contact')}
            className="text-slate-300 hover:text-amber-400 transition-colors cursor-pointer py-1"
          >
            {language === 'hi' ? 'संपर्क करें (Contact Us)' : 'Contact Us'}
          </button>
          <span className="text-slate-700 hidden sm:inline">·</span>
          <button
            onClick={() => onOpenLegalPage('privacy')}
            className="text-slate-300 hover:text-amber-400 transition-colors cursor-pointer py-1"
          >
            {language === 'hi' ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
          </button>
          <span className="text-slate-700 hidden sm:inline">·</span>
          <button
            onClick={() => onOpenLegalPage('disclaimer')}
            className="text-slate-300 hover:text-amber-400 transition-colors cursor-pointer py-1"
          >
            {language === 'hi' ? 'अस्वीकरण (Disclaimer)' : 'Disclaimer'}
          </button>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-start gap-2 max-w-2xl text-left">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <b>{language === 'hi' ? 'अस्वीकरण:' : 'Disclaimer:'}</b>{' '}
              {language === 'hi'
                ? 'ExamSetu & Toolkit एक स्वतंत्र सार्वजनिक शैक्षिक सूचना पोर्टल है और किसी भी सरकारी विभाग, मंत्रालय या परीक्षा बोर्ड से संबद्ध या अधिकृत नहीं है। सभी उम्मीदवार अंतिम आवेदन से पहले आधिकारिक सरकारी वेबसाइटों पर जारी मूल अधिसूचना की पुष्टि अवश्य करें।'
                : 'ExamSetu & Toolkit is an independent public educational information portal and is not affiliated with, associated with, or authorized by any government department, agency, or examination board. All candidates are advised to verify all notifications and dates on official government websites.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 shrink-0">
            <span className="text-[11px] text-slate-500 text-center">
              © {new Date().getFullYear()} ExamSetu &amp; Toolkit · All rights reserved
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-semibold shrink-0 cursor-pointer"
            >
              <span>{language === 'hi' ? 'ऊपर जाएं' : 'Top'}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
