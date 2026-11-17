import React from 'react';
import {
  X,
  Calendar,
  IndianRupee,
  UserCheck,
  Briefcase,
  GraduationCap,
  FileText,
  ExternalLink,
  Bookmark,
  Share2,
  CheckCircle2,
  Info,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { ExamItem, ProcessType, Language } from '../types/exam';
import { BOARD_LOGIN_DATA } from '../data/exams';
import { TRANSLATIONS, QUALIFICATION_LABELS } from '../data/translations';
import {
  validateExamUrlSecurity,
  resolveExamProcessUrl,
  UrlSecurityResult,
} from '../utils/urlSecurity';

interface ExamDetailModalProps {
  exam: ExamItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenProcessGuide: (exam: ExamItem, process: ProcessType) => void;
  onAskAI?: (exam: ExamItem) => void;
  isBookmarked: boolean;
  onToggleBookmark: (examName: string) => void;
  language: Language;
}

export const ExamDetailModal: React.FC<ExamDetailModalProps> = ({
  exam,
  isOpen,
  onClose,
  onOpenProcessGuide,
  onAskAI,
  isBookmarked,
  onToggleBookmark,
  language,
}) => {
  const [copiedShare, setCopiedShare] = React.useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);
  const [isTooltipPinned, setIsTooltipPinned] = React.useState(false);
  const tooltipContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setIsTooltipOpen(false);
    setIsTooltipPinned(false);
  }, [isOpen, exam?.n]);

  React.useEffect(() => {
    if (!isTooltipOpen) return;
    const handleOutsideOrEsc = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent) {
        if (e.key === 'Escape') {
          setIsTooltipOpen(false);
          setIsTooltipPinned(false);
        }
        return;
      }
      if (
        tooltipContainerRef.current &&
        !tooltipContainerRef.current.contains(e.target as Node)
      ) {
        setIsTooltipOpen(false);
        setIsTooltipPinned(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideOrEsc);
    document.addEventListener('keydown', handleOutsideOrEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutsideOrEsc);
      document.removeEventListener('keydown', handleOutsideOrEsc);
    };
  }, [isTooltipOpen]);

  if (!isOpen || !exam) return null;

  const t = TRANSLATIONS[language];
  const d = exam.d || {};
  const boardInfo = BOARD_LOGIN_DATA[exam.o] || BOARD_LOGIN_DATA['SSC'];

  const applySecurity = validateExamUrlSecurity(
    resolveExamProcessUrl(exam, 'Apply Online', boardInfo)
  );
  const pdfSecurity = exam.f ? validateExamUrlSecurity(exam.f) : null;
  const admitSecurity = validateExamUrlSecurity(
    resolveExamProcessUrl(exam, 'Admit Card', boardInfo)
  );
  const resultSecurity = validateExamUrlSecurity(
    resolveExamProcessUrl(exam, 'Result', boardInfo)
  );
  const answerKeySecurity = validateExamUrlSecurity(
    resolveExamProcessUrl(exam, 'Answer Key', boardInfo)
  );
  const syllabusSecurity = exam.s ? validateExamUrlSecurity(exam.s) : null;
  const portalSecurity = validateExamUrlSecurity(exam.u);

  const allCheckedLinks = [
    applySecurity,
    pdfSecurity,
    admitSecurity,
    resultSecurity,
    answerKeySecurity,
    syllabusSecurity,
    portalSecurity,
  ].filter((item): item is UrlSecurityResult => item !== null);
  const allLinksSecure = allCheckedLinks.every((item) => item.isSecure);

  const renderSecurityBadge = (
    sec: UrlSecurityResult,
    tone: 'default' | 'onAmber' | 'onDark' | 'onEmerald' = 'default'
  ) => {
    const label = sec.isSecure
      ? 'HTTPS'
      : language === 'hi'
      ? 'असुरक्षित'
      : 'HTTP';

    const styleClass =
      tone === 'onAmber'
        ? sec.isSecure
          ? 'bg-rose-950/15 text-rose-950 border-rose-950/20'
          : 'bg-rose-700 text-white border-rose-800'
        : tone === 'onDark'
        ? sec.isSecure
          ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
          : 'bg-amber-500/25 text-amber-200 border-amber-400/40'
        : tone === 'onEmerald'
        ? sec.isSecure
          ? 'bg-white/20 text-white border-white/30'
          : 'bg-rose-700 text-white border-rose-800'
        : sec.isSecure
        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
        : 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800';

    return (
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight border shrink-0 ${styleClass}`}
        title={language === 'hi' ? sec.labelHi : sec.labelEn}
      >
        {sec.isSecure ? (
          <ShieldCheck className="w-3 h-3 shrink-0" />
        ) : (
          <ShieldAlert className="w-3 h-3 shrink-0" />
        )}
        <span>{label}</span>
      </span>
    );
  };

  const displayName = language === 'hi' && exam.n_hi ? exam.n_hi : exam.n;
  const displayOrg = language === 'hi' && exam.o_hi ? exam.o_hi : exam.o;
  const displayStatus = language === 'hi' && exam.st_hi ? exam.st_hi : exam.st;
  const qualLabel = QUALIFICATION_LABELS[exam.q]?.[language] || exam.q;

  const summaryText = language === 'hi' && d.sum_hi ? d.sum_hi : d.sum;
  const datesList = language === 'hi' && d.dates_hi && d.dates_hi.length > 0 ? d.dates_hi : d.dates;
  const feeList = language === 'hi' && d.fee_hi && d.fee_hi.length > 0 ? d.fee_hi : d.fee;
  const ageText = language === 'hi' && d.age_hi ? d.age_hi : d.age;
  const vacText = language === 'hi' && d.vac_hi ? d.vac_hi : d.vac;
  const elText = language === 'hi' && d.el_hi ? d.el_hi : d.el;
  const selText = language === 'hi' && d.sel_hi ? d.sel_hi : d.sel;

  const handleShare = () => {
    const text = `${displayName} (${displayOrg}) - ${t.officialPortalVerified} | ExamSetu & Toolkit`;
    if (navigator.share) {
      navigator.share({ title: displayName, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const getStatusBadge = () => {
    if (!displayStatus) return null;
    const isRed = exam.sc === 'red';
    const isGreen = exam.sc === 'green';
    const isBlue = exam.sc === 'blue';
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold ${
          isRed
            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
            : isGreen
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
            : isBlue
            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {displayStatus}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border-t-4 sm:border sm:border-t-4 border-amber-500 rounded-t-3xl sm:rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-900 dark:text-slate-100 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                {displayOrg}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{exam.c}</span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{qualLabel}</span>
              </span>
              {getStatusBadge()}
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {displayName}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleBookmark(exam.n)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this exam'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Share exam details"
            >
              {copiedShare ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300">
          {/* Prototype / Verification note */}
          {(d.sample || d.demo) && (
            <div className="p-3 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border border-dashed border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                {language === 'hi'
                  ? 'प्रमाणित पोर्टल डेटा। आवेदन करने से पहले आधिकारिक भर्ती विज्ञापन पीडीएफ पर सभी तिथियों एवं पात्रता की जांच अवश्य करें।'
                  : 'Verified portal data. Exact dates, fees and category quotas must be confirmed on the official recruitment notification PDF before applying.'}
              </span>
            </div>
          )}

          {/* Short Summary */}
          {summaryText && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-2 border-l-3 border-amber-500 pl-2">
                {t.overviewHeading}
              </h4>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">{summaryText}</p>
            </div>
          )}

          {/* Important Dates Table */}
          {datesList && datesList.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-2.5 border-l-3 border-amber-500 pl-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{t.datesHeading}</span>
              </h4>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <tbody>
                    {datesList.map(([label, val], idx) => (
                      <tr
                        key={idx}
                        className={
                          idx % 2 === 0
                            ? 'bg-slate-50/60 dark:bg-slate-800/40'
                            : 'bg-white dark:bg-slate-900'
                        }
                      >
                        <td className="py-2 px-3 sm:px-4 font-semibold text-slate-900 dark:text-white border-b border-slate-200/60 dark:border-slate-800/60 w-1/2 sm:w-2/5">
                          {label}
                        </td>
                        <td className="py-2 px-3 sm:px-4 font-mono tabular-nums text-slate-600 dark:text-slate-300 border-b border-slate-200/60 dark:border-slate-800/60">
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Application Fee */}
          {feeList && feeList.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-2.5 border-l-3 border-amber-500 pl-2 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>{t.feesHeading}</span>
              </h4>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <tbody>
                    {feeList.map(([cat, amount], idx) => (
                      <tr
                        key={idx}
                        className={
                          idx % 2 === 0
                            ? 'bg-slate-50/60 dark:bg-slate-800/40'
                            : 'bg-white dark:bg-slate-900'
                        }
                      >
                        <td className="py-2 px-3 sm:px-4 font-semibold text-slate-900 dark:text-white border-b border-slate-200/60 dark:border-slate-800/60 w-1/2 sm:w-2/5">
                          {cat}
                        </td>
                        <td className="py-2 px-3 sm:px-4 font-mono tabular-nums text-slate-600 dark:text-slate-300 border-b border-slate-200/60 dark:border-slate-800/60">
                          {amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Age Limit */}
          {ageText && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-2 border-l-3 border-amber-500 pl-2 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{t.ageHeading}</span>
              </h4>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">{ageText}</p>
            </div>
          )}

          {/* Vacancies */}
          {vacText && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-2 border-l-3 border-amber-500 pl-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{t.vacanciesHeading}</span>
              </h4>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">{vacText}</p>
            </div>
          )}

          {/* Eligibility Criteria */}
          {elText && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-2 border-l-3 border-amber-500 pl-2 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{t.eligibilityHeading}</span>
              </h4>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">{elText}</p>
            </div>
          )}

          {/* Selection Process */}
          {selText && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-2 border-l-3 border-amber-500 pl-2">
                {t.selectionHeading}
              </h4>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">{selText}</p>
            </div>
          )}

          {/* Direct Verified Links & Step-by-Step Guides */}
          <div>
            <div
              ref={tooltipContainerRef}
              className="relative flex flex-wrap items-center justify-between gap-2 mb-3"
              onMouseLeave={() => {
                if (!isTooltipPinned) setIsTooltipOpen(false);
              }}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 border-l-3 border-amber-500 pl-2">
                {t.officialGuidesHeading}
              </h4>

              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                    allLinksSecure
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                  }`}
                >
                  {allLinksSecure ? (
                    <Lock className="w-3 h-3 shrink-0" />
                  ) : (
                    <ShieldAlert className="w-3 h-3 shrink-0" />
                  )}
                  <span>
                    {allLinksSecure
                      ? language === 'hi'
                        ? 'HTTPS सुरक्षित लिंक'
                        : 'HTTPS Verified'
                      : language === 'hi'
                      ? 'असुरक्षित लिंक चेतावनी'
                      : 'Non-HTTPS Link Found'}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={() => {
                    const next = !isTooltipPinned || !isTooltipOpen;
                    setIsTooltipPinned(next);
                    setIsTooltipOpen(next);
                  }}
                  onMouseEnter={() => setIsTooltipOpen(true)}
                  onFocus={() => setIsTooltipOpen(true)}
                  onBlur={(e) => {
                    if (
                      !isTooltipPinned &&
                      !tooltipContainerRef.current?.contains(e.relatedTarget as Node)
                    ) {
                      setIsTooltipOpen(false);
                    }
                  }}
                  aria-expanded={isTooltipOpen}
                  aria-describedby="url-security-tooltip"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>{language === 'hi' ? 'सुरक्षा जानकारी' : 'Secure vs Insecure'}</span>
                </button>
              </div>

              {isTooltipOpen && (
                <div
                  id="url-security-tooltip"
                  role="tooltip"
                  className="absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-2 sm:w-96 max-w-full z-30 p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 shadow-xl text-xs text-slate-700 dark:text-slate-300 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      <span>
                        {language === 'hi'
                          ? 'सुरक्षित (HTTPS) बनाम असुरक्षित (HTTP) लिंक'
                          : 'Secure (HTTPS) vs Insecure (HTTP) Links'}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsTooltipOpen(false);
                        setIsTooltipPinned(false);
                      }}
                      className="p-0.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                      aria-label={language === 'hi' ? 'टूलटिप बंद करें' : 'Close security info'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/70 space-y-1">
                    <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {language === 'hi'
                          ? 'सुरक्षित लिंक (https://)'
                          : 'Secure Link (https://)'}
                      </span>
                    </div>
                    <p className="leading-relaxed text-[11px] text-emerald-900/90 dark:text-emerald-200/90">
                      {language === 'hi'
                        ? 'डेटा ब्राउज़र और सर्वर के बीच SSL/TLS से एन्क्रिप्ट रहता है। OTR, पंजीकरण संख्या, जन्मतिथि और दस्तावेज दर्ज करना सुरक्षित है।'
                        : 'Uses encrypted SSL/TLS transport so your OTR ID, registration details, DOB, and PDF downloads cannot be intercepted in transit.'}
                    </p>
                  </div>

                  <div className="p-2 rounded-lg bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/70 space-y-1">
                    <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {language === 'hi'
                          ? 'असुरक्षित लिंक (http:// या त्रुटि)'
                          : 'Insecure Link (http:// or invalid URL)'}
                      </span>
                    </div>
                    <p className="leading-relaxed text-[11px] text-rose-900/90 dark:text-rose-200/90">
                      {language === 'hi'
                        ? 'डेटा बिना एन्क्रिप्शन भेजा जाता है या ब्राउज़र सुरक्षा चेतावनी दिखा सकता है। संवेदनशील विवरण न भरें—केवल आधिकारिक https:// (.gov.in / .nic.in) पोर्टल का उपयोग करें।'
                        : 'Traffic is unencrypted or lacks a verified HTTPS certificate. Avoid entering passwords or personal details and prefer verified https:// (.gov.in / .nic.in) portals.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Apply Online */}
              <button
                onClick={() => onOpenProcessGuide(exam, 'Apply Online')}
                className="p-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-rose-950 font-bold text-xs sm:text-sm text-left flex items-center justify-between gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <span>
                  {language === 'hi' ? 'ऑनलाइन आवेदन – चरण और चेकलिस्ट' : 'Apply Online – checklist & steps'}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {renderSecurityBadge(applySecurity, 'onAmber')}
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </div>
              </button>

              {/* Official PDF */}
              {exam.f && pdfSecurity ? (
                <a
                  href={exam.f}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-semibold text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors shadow-sm border border-amber-500/40"
                >
                  <span className="flex items-center gap-1.5 min-w-0">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="truncate">{t.officialNotificationPdf}</span>
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {renderSecurityBadge(pdfSecurity, 'onDark')}
                    <ExternalLink className="w-4 h-4 shrink-0" />
                  </div>
                </a>
              ) : null}

              {/* Admit Card */}
              <button
                onClick={() => onOpenProcessGuide(exam, 'Admit Card')}
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm text-left flex items-center justify-between gap-2 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <span>
                  {language === 'hi' ? 'एडमिट कार्ड – चेकलिस्ट और चरण' : 'Admit Card – checklist & steps'}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {renderSecurityBadge(admitSecurity)}
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </div>
              </button>

              {/* Result */}
              <button
                onClick={() => onOpenProcessGuide(exam, 'Result')}
                className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm text-left flex items-center justify-between gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <span>
                  {language === 'hi' ? 'रिजल्ट और स्कोरकार्ड गाइड' : 'Result & Scorecard Guide'}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {renderSecurityBadge(resultSecurity, 'onEmerald')}
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </div>
              </button>

              {/* Answer Key */}
              <button
                onClick={() => onOpenProcessGuide(exam, 'Answer Key')}
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm text-left flex items-center justify-between gap-2 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <span>
                  {language === 'hi' ? 'उत्तर कुंजी और आपत्ति' : 'Answer Key & Objections'}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {renderSecurityBadge(answerKeySecurity)}
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </div>
              </button>

              {/* Syllabus */}
              {exam.s && syllabusSecurity && (
                <a
                  href={exam.s}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <span>
                    {language === 'hi' ? 'पाठ्यक्रम और परीक्षा पैटर्न' : 'Syllabus & Exam Pattern'}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {renderSecurityBadge(syllabusSecurity)}
                    <ExternalLink className="w-4 h-4 shrink-0" />
                  </div>
                </a>
              )}
            </div>

            {/* Official Website & Live AI Search */}
            <div className="mt-3 flex flex-col sm:flex-row gap-2.5">
              <a
                href={exam.u}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>
                  {language === 'hi'
                    ? `${displayOrg} का आधिकारिक पोर्टल खोलें`
                    : `Open ${exam.o} Official Portal`}
                </span>
                {renderSecurityBadge(portalSecurity)}
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
              {onAskAI && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onAskAI(exam);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-900 to-rose-950 hover:from-rose-950 hover:to-slate-900 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <span>
                    {language === 'hi' ? 'AI से ताजा अपडेट पूछें' : 'Verify Live via AI Search'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Close */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-bold transition-colors cursor-pointer"
          >
            {t.closeDetails}
          </button>
        </div>
      </div>
    </div>
  );
};
