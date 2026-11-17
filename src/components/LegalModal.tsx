import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  Send,
} from 'lucide-react';
import { Language, LegalPage } from '../types/exam';

interface LegalModalProps {
  isOpen: boolean;
  activePage: LegalPage | null;
  onClose: () => void;
  onSelectPage: (page: LegalPage) => void;
  language: Language;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  activePage,
  onClose,
  onSelectPage,
  language,
}) => {
  // Contact form state
  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen || !activePage) return null;

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const fullMsg = `*ExamSetu & Toolkit Contact Request*\n*Name:* ${senderName || 'Anonymous'}\n*Contact:* ${
      senderContact || 'Not provided'
    }\n*Topic:* ${subject}\n\n*Message:*\n${message}`;
    const url = `https://wa.me/917070385665?text=${encodeURIComponent(fullMsg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsSent(true);
    setTimeout(() => setIsSent(false), 4000);
  };

  const handleSendEmail = () => {
    if (!message.trim()) return;
    const body = `Name: ${senderName || 'Anonymous'}\nContact: ${
      senderContact || 'Not provided'
    }\nTopic: ${subject}\n\nMessage:\n${message}`;
    const mailto = `mailto:anishrazzanishrazz789@gmail.com?subject=${encodeURIComponent(
      `[ExamSetu & Toolkit] ${subject}`
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setIsSent(true);
    setTimeout(() => setIsSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border-t-4 sm:border sm:border-t-4 border-amber-500 rounded-t-3xl sm:rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-900 dark:text-slate-100 animate-in slide-in-from-bottom duration-200">
        {/* Maroon Header */}
        <div className="p-5 sm:p-6 pb-4 bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white rounded-t-2xl flex items-start justify-between gap-4 border-b border-amber-500/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                ExamSetu &amp; Toolkit Legal &amp; Information
              </span>
              <span className="text-rose-300">·</span>
              <span className="text-xs text-rose-200">
                {language === 'hi' ? 'आधिकारिक सूचना' : 'Official Notice'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {activePage === 'about' &&
                (language === 'hi' ? 'हमारे बारे में (About Us)' : 'About ExamSetu & Toolkit')}
              {activePage === 'contact' && (language === 'hi' ? 'संपर्क करें (Contact Us)' : 'Contact Us')}
              {activePage === 'privacy' &&
                (language === 'hi' ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy')}
              {activePage === 'disclaimer' &&
                (language === 'hi' ? 'अस्वीकरण (Disclaimer)' : 'Disclaimer')}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation bar inside Modal for seamless reading */}
        <div className="px-5 sm:px-6 py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => onSelectPage('about')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activePage === 'about'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {language === 'hi' ? 'हमारे बारे में' : 'About Us'}
          </button>
          <button
            onClick={() => onSelectPage('contact')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activePage === 'contact'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {language === 'hi' ? 'संपर्क करें' : 'Contact Us'}
          </button>
          <button
            onClick={() => onSelectPage('privacy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activePage === 'privacy'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}
          </button>
          <button
            onClick={() => onSelectPage('disclaimer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activePage === 'disclaimer'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {language === 'hi' ? 'अस्वीकरण' : 'Disclaimer'}
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {/* ================= PAGE 1: ABOUT US ================= */}
          {activePage === 'about' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-slate-800 dark:text-slate-200">
                <h3 className="text-base font-bold text-rose-950 dark:text-amber-300 mb-1 flex items-center gap-2">
                  <Info className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>
                    {language === 'hi'
                      ? 'एग्जामसेतु एवं टूलकिट: भारतीय प्रतियोगी परीक्षाओं का विश्वसनीय मंच'
                      : 'About ExamSetu & Toolkit – Dedicated to Indian Aspirants'}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm mt-1">
                  {language === 'hi'
                    ? 'ExamSetu & Toolkit एक स्वतंत्र शैक्षणिक सूचना पोर्टल है, जिसका उद्देश्य लाखों सरकारी नौकरी अभ्यर्थियों को नवीनतम परीक्षा तिथियां, आधिकारिक अधिसूचनाएं, सीधे आवेदन लिंक और नि:शुल्क ऑनलाइन फॉर्म टूल्स उपलब्ध कराना है।'
                    : 'ExamSetu & Toolkit is an independent educational web portal created to empower millions of government exam aspirants across India with prompt, verified exam notifications, direct portal links, and essential client-side utility tools.'}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-2 border-l-3 border-amber-500 pl-2">
                  {language === 'hi' ? 'हम क्या प्रदान करते हैं' : 'What We Provide'}
                </h4>
                <ul className="space-y-2 list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <li>
                    <b>
                      {language === 'hi'
                        ? 'विस्तृत भर्ती कवरेज:'
                        : 'Comprehensive Exam Updates:'}
                    </b>{' '}
                    {language === 'hi'
                      ? 'SSC (CGL, CHSL, MTS, GD), Railways (RRB NTPC, Group D, ALP), Banking (IBPS, SBI, RBI), Defence (NDA, CDS, Army Agniveer), और राज्य स्तरीय भर्ती आयोग (BPSC, UPPSC आदि)।'
                      : 'SSC (CGL, CHSL, MTS, GD), Railways (RRB NTPC, Group D, ALP), Banking (IBPS, SBI, RBI), Defence (NDA, CDS, Army Agniveer), and State PSCs (BPSC, UPPSC, etc.).'}
                  </li>
                  <li>
                    <b>
                      {language === 'hi'
                        ? 'शैक्षणिक योग्यता अनुसार फ़िल्टर:'
                        : 'Qualification-Based Filtering:'}
                    </b>{' '}
                    {language === 'hi'
                      ? '10वीं पास, 12वीं पास और स्नातक (Graduate) स्तर की परीक्षाओं को 1-क्लिक में अलग करके देखने की सुविधा।'
                      : 'Dual-layer filtering allowing 10th pass, 12th pass, and graduate candidates to quickly isolate eligible jobs.'}
                  </li>
                  <li>
                    <b>
                      {language === 'hi'
                        ? '1-क्लिक द्विभाषी अनुभव (हिंदी / English):'
                        : '1-Click Bilingual Experience:'}
                    </b>{' '}
                    {language === 'hi'
                      ? 'हिंदी माध्यम के परीक्षार्थियों की सुविधा के लिए परीक्षा विवरण, पात्रता नियम और चेकलिस्ट पूरी तरह हिंदी में भी उपलब्ध हैं।'
                      : 'Complete English and Hindi translations for exam summaries, eligibility, and step-by-step application checklists.'}
                  </li>
                  <li>
                    <b>
                      {language === 'hi'
                        ? 'मुफ्त उपयोगी छात्र टूल्स (100% निजी):'
                        : 'Free Student Form Utilities (100% Private):'}
                    </b>{' '}
                    {language === 'hi'
                      ? 'फोटो व हस्ताक्षर रीसाइज़र (बोर्ड मानकों और नाम/DOP स्टाम्प सहित), कट-ऑफ आयु कैलकुलेटर, और मार्कशीट फोटो से 300 KB से छोटी PDF बनाने का टूल।'
                      : 'Photo & Signature Resizer with official board specs and Name/DOP stamp, Age & Eligibility Calculator, and Photo to PDF (<300 KB) compiler.'}
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-2 border-l-3 border-amber-500 pl-2">
                  {language === 'hi' ? 'हमारा संकल्प' : 'Our Commitment to Integrity'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {language === 'hi'
                    ? 'हम बिना किसी फर्जी लिंक, क्लिकबेट या भ्रामक विज्ञापनों के केवल प्रामाणिक सरकारी वेबसाइटों (gov.in / nic.in) के सीधे लिंक प्रदान करते हैं। विद्यार्थी का समय और विश्वास हमारी सर्वोच्च प्राथमिकता है।'
                    : 'We reject spam, sensational headlines, and fraudulent recruitment claims. Every external link on ExamSetu & Toolkit directs candidates strictly to verified government commission portals (.gov.in / .nic.in / .ac.in).'}
                </p>
              </div>
            </div>
          )}

          {/* ================= PAGE 2: CONTACT US ================= */}
          {activePage === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Box */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                      {language === 'hi' ? 'आधिकारिक सपोर्ट ईमेल' : 'Official Support Email'}
                    </span>
                    <a
                      href="mailto:anishrazzanishrazz789@gmail.com"
                      className="text-sm font-bold text-rose-800 dark:text-amber-400 hover:underline break-all"
                    >
                      anishrazzanishrazz789@gmail.com
                    </a>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      {language === 'hi' ? 'प्रतिक्रिया समय: 24–48 घंटे' : 'Response time: 24–48 hours'}
                    </span>
                  </div>
                </div>

                {/* WhatsApp & Operator Details */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                      {language === 'hi' ? 'व्हाट्सएप व संपर्क सूत्र' : 'Operator & WhatsApp'}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">
                      Anish Kumar
                    </span>
                    <a
                      href="https://wa.me/917070385665"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      <span>WhatsApp: +91 7070385665</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Simple Interactive Contact Form */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'hi' ? 'हमें संदेश भेजें' : 'Send Us a Message'}
                  </h3>
                </div>

                {isSent && (
                  <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {language === 'hi'
                        ? 'आपका संदेश तैयार है! हम जल्द ही उत्तर देंगे।'
                        : 'Your message has been initiated! We will get back to you shortly.'}
                    </span>
                  </div>
                )}

                <form onSubmit={handleSendWhatsApp} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'hi' ? 'आपका नाम' : 'Your Name'}
                      </label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full py-2 px-3 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {language === 'hi' ? 'ईमेल या मोबाइल नंबर' : 'Email or Phone'}
                      </label>
                      <input
                        type="text"
                        value={senderContact}
                        onChange={(e) => setSenderContact(e.target.value)}
                        placeholder="e.g. rahul@example.com / 9876543210"
                        className="w-full py-2 px-3 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'hi' ? 'विषय' : 'Subject / Topic'}
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full py-2 px-3 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="General Inquiry">
                        {language === 'hi' ? 'सामान्य प्रश्न (General Inquiry)' : 'General Inquiry'}
                      </option>
                      <option value="Exam Date or Notification Correction">
                        {language === 'hi'
                          ? 'परीक्षा तिथि या सूचना सुधार (Exam Correction)'
                          : 'Exam Date or Notification Correction'}
                      </option>
                      <option value="Photo/PDF Tool Feedback">
                        {language === 'hi'
                          ? 'फॉर्म टूल संबंधी सुझाव (Tool Feedback)'
                          : 'Photo/PDF Tool Feedback'}
                      </option>
                      <option value="Partnership & Advertising">
                        {language === 'hi'
                          ? 'सहभागिता व विज्ञापन (Partnership)'
                          : 'Partnership & Advertising'}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'hi' ? 'आपका संदेश' : 'Your Message'}
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        language === 'hi'
                          ? 'अपना संदेश या प्रश्न यहां लिखें...'
                          : 'Write your question or feedback here...'
                      }
                      required
                      className="w-full py-2 px-3 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{language === 'hi' ? 'व्हाट्सएप से भेजें (+91 7070385665)' : 'Send via WhatsApp'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSendEmail}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{language === 'hi' ? 'ईमेल द्वारा भेजें' : 'Send via Email'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ================= PAGE 3: PRIVACY POLICY ================= */}
          {activePage === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <span>
                  <b>Effective Date:</b> November 2026 · ExamSetu &amp; Toolkit (https://examsetu.in)
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-1.5 border-l-3 border-amber-500 pl-2">
                  1. Introduction &amp; Scope
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Welcome to ExamSetu &amp; Toolkit. This Privacy Policy describes how ExamSetu &amp; Toolkit collects, uses, and
                  safeguards your personal information when you visit our website. By using our website,
                  you consent to the data practices described in this policy.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-1.5 border-l-3 border-amber-500 pl-2">
                  2. Log Files &amp; Standard Web Analytics
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Like most website operators, ExamSetu &amp; Toolkit uses standard log files. The information inside
                  the log files includes internet protocol (IP) addresses, browser type, Internet Service
                  Provider (ISP), date/time stamp, referring/exit pages, and number of clicks. This data
                  is not linked to any information that is personally identifiable and is used solely for
                  analyzing trends, administering the site, and tracking visitor movement.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-1.5 border-l-3 border-amber-500 pl-2">
                  3. Cookies and Web Beacons
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  ExamSetu &amp; Toolkit uses cookies to store information about visitors&apos; preferences, record
                  user-specific information on which pages the user accesses, and customize web page
                  content based on visitors&apos; browser type or other information that the visitor
                  sends via their browser.
                </p>
              </div>

              {/* Google AdSense & DoubleClick section */}
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 dark:text-amber-300 mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>4. Google AdSense &amp; DoubleClick DART Cookies</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  Google is a third-party vendor on our site. It uses cookies, known as DART cookies, to
                  serve ads to our site visitors based upon their visit to ExamSetu &amp; Toolkit and other sites on the
                  internet. Users may choose to decline the use of DART cookies by visiting the Google
                  Ad and Content Network Privacy Policy at{' '}
                  <a
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-800 dark:text-amber-400 font-semibold underline"
                  >
                    https://policies.google.com/technologies/ads
                  </a>
                  . You may also opt out of personalized advertising by visiting{' '}
                  <a
                    href="https://www.aboutads.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-800 dark:text-amber-400 font-semibold underline"
                  >
                    aboutads.info
                  </a>
                  .
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-1.5 border-l-3 border-amber-500 pl-2">
                  5. Third-Party Advertising Partners
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web
                  Beacons in their respective advertisements and links that appear on ExamSetu &amp; Toolkit. They
                  automatically receive your IP address when this occurs. These technologies are used to
                  measure the effectiveness of their advertising campaigns and/or to personalize the
                  advertising content that you see. ExamSetu &amp; Toolkit has no access to or control over these cookies
                  used by third-party advertisers.
                </p>
              </div>

              {/* Student Tool Privacy Guarantee */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>6. Student Tool Data: Zero-Server-Storage Guarantee</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  When you use ExamSetu &amp; Toolkit&apos;s Photo &amp; Signature Resizer, Age &amp; Eligibility
                  Calculator, or Photo to PDF Compressor, <b>all processing is performed 100% locally in your
                  browser</b> using HTML5 Canvas and client-side JavaScript. <b>No photographs, signatures,
                  birth dates, or educational marksheets are ever transmitted to, stored on, or viewed by our
                  servers.</b>
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-1.5 border-l-3 border-amber-500 pl-2">
                  7. CCPA &amp; GDPR Privacy Rights
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Users have the right to request access to their personal data, rectify inaccuracies,
                  request erasure, or object to processing. If you make a request, we have one month to
                  respond to you. To exercise any of these rights, please contact us at{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    anishrazzanishrazz789@gmail.com
                  </span>
                  .
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-1.5 border-l-3 border-amber-500 pl-2">
                  8. Children&apos;s Information
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  ExamSetu &amp; Toolkit does not knowingly collect any Personal Identifiable Information from children
                  under the age of 13. If you believe your child provided this kind of information on our
                  website, we strongly encourage you to contact us immediately.
                </p>
              </div>
            </div>
          )}

          {/* ================= PAGE 4: DISCLAIMER ================= */}
          {activePage === 'disclaimer' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-slate-800 dark:text-slate-200">
                <h3 className="text-sm font-bold text-rose-950 dark:text-rose-300 mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>
                    {language === 'hi'
                      ? 'गैर-सरकारी एवं स्वतंत्र शैक्षणिक पोर्टल प्रकटीकरण'
                      : 'Non-Government & Independent Educational Portal Disclosure'}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed">
                  {language === 'hi'
                    ? 'ExamSetu & Toolkit एक गैर-सरकारी, निजी शैक्षिक सूचना पोर्टल है। यह किसी भी सरकारी मंत्रालय, विभाग, लोक सेवा आयोग या परीक्षा बोर्ड से आधिकारिक रूप से संबद्ध, अधिकृत या संचालित नहीं है।'
                    : 'ExamSetu & Toolkit is a private educational web portal and is NOT affiliated with, endorsed by, authorized by, or in any way officially connected to any government organization, commission, ministry, or official examination conducting body.'}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-1.5 border-l-3 border-amber-500 pl-2">
                  {language === 'hi' ? 'केवल सूचनात्मक उद्देश्य' : 'Educational & Informational Purpose Only'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {language === 'hi'
                    ? 'इस वेबसाइट पर प्रकाशित समस्त सूचनाएं केवल विद्यार्थियों और अभ्यर्थियों के सामान्य मार्गदर्शन के लिए संकलित की जाती हैं। यद्यपि हम केवल आधिकारिक स्रोतों से प्रमाणित जानकारी प्रकाशित करते हैं, फिर भी किसी भी परीक्षा में आवेदन करने, शुल्क जमा करने या यात्रा योजना बनाने से पहले उम्मीदवार संबंधित आयोग के आधिकारिक भर्ती विज्ञापन (Notification PDF) की जांच अवश्य करें।'
                    : 'All contents published on ExamSetu & Toolkit are for general educational guidance and reference purposes only. Although every effort is made to maintain verified accuracy, candidates must strictly verify all eligibility criteria, fees, vacancy counts, and cutoff dates directly from the official notification PDF published by the relevant examination commission.'}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-1.5 border-l-3 border-amber-500 pl-2">
                  {language === 'hi' ? 'दायित्व का अभाव (Limitation of Liability)' : 'Limitation of Liability'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {language === 'hi'
                    ? 'ExamSetu & Toolkit किसी भी लिपिकीय त्रुटि, तिथियों में सरकारी बदलाव, अथवा तीसरे पक्ष के सरकारी पोर्टलों पर होने वाली तकनीकी खामियों के लिए उत्तरदायी नहीं होगा।'
                    : 'ExamSetu & Toolkit and its operators shall not be held liable for any inaccuracies, scheduling changes, exam postponements, or technical errors occurring on external government recruitment portals.'}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-1.5 border-l-3 border-amber-500 pl-2">
                  {language === 'hi' ? 'सीधे सत्यापित सरकारी पोर्टल' : 'Official Commission Portals'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-2">
                  {language === 'hi'
                    ? 'पुष्टि के लिए प्रमुख सरकारी भर्ती आयोगों की आधिकारिक वेबसाइटें:'
                    : 'Always verify through primary government websites:'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <a
                    href="https://upsc.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-amber-600 flex items-center justify-between"
                  >
                    <span>UPSC Portal</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                  <a
                    href="https://ssc.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-amber-600 flex items-center justify-between"
                  >
                    <span>SSC Portal</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                  <a
                    href="https://www.rrbapply.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-amber-600 flex items-center justify-between"
                  >
                    <span>RRB Portal</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                  <a
                    href="https://www.ibps.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-amber-600 flex items-center justify-between"
                  >
                    <span>IBPS Portal</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                  <a
                    href="https://nta.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-amber-600 flex items-center justify-between"
                  >
                    <span>NTA Portal</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                  <a
                    href="https://bpsc.bihar.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-amber-600 flex items-center justify-between"
                  >
                    <span>BPSC Portal</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Close Button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 rounded-b-2xl flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            ExamSetu &amp; Toolkit · {language === 'hi' ? 'विश्वसनीय शैक्षिक मंच' : 'Trusted Educational Portal'}
          </span>
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
