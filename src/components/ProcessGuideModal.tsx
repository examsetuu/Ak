import React from 'react';
import { X, CheckSquare, Square, ExternalLink, ClipboardCheck } from 'lucide-react';
import { ExamItem, ProcessType, Language } from '../types/exam';
import { BOARD_LOGIN_DATA } from '../data/exams';
import { TRANSLATIONS } from '../data/translations';

interface ProcessGuideModalProps {
  exam: ExamItem | null;
  processType: ProcessType | null;
  onClose: () => void;
  language: Language;
}

export const ProcessGuideModal: React.FC<ProcessGuideModalProps> = ({
  exam,
  processType,
  onClose,
  language,
}) => {
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});

  if (!exam || !processType) return null;

  const t = TRANSLATIONS[language];
  const boardInfo = BOARD_LOGIN_DATA[exam.o] || BOARD_LOGIN_DATA['SSC'];

  const displayName = language === 'hi' && exam.n_hi ? exam.n_hi : exam.n;
  const boardName = language === 'hi' && boardInfo.name_hi ? boardInfo.name_hi : boardInfo.name;

  // Bilingual steps selection
  const stepsSource =
    language === 'hi' && boardInfo.steps_hi && boardInfo.steps_hi[processType]
      ? boardInfo.steps_hi[processType]
      : boardInfo.steps[processType] || [
          language === 'hi'
            ? 'नीचे दिए गए बटन से आधिकारिक पोर्टल खोलें।'
            : 'Open the official website using the button below.',
          language === 'hi'
            ? 'आधिकारिक पोर्टल के निर्देशों का पालन करें।'
            : 'Follow official portal guidelines.',
          language === 'hi'
            ? 'आवेदन विवरण और पंजीकरण संख्या सुरक्षित रखें।'
            : 'Keep your application details safe.',
        ];

  // Bilingual requirements selection
  const reqSource =
    language === 'hi' && boardInfo.req_hi && boardInfo.req_hi[processType]
      ? boardInfo.req_hi[processType]
      : (boardInfo.req && boardInfo.req[processType]) || [];

  const toggleCheck = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  // Determine direct target URL
  const mapKey: Record<ProcessType, string | undefined> = {
    'Apply Online': exam.p,
    'Admit Card': exam.a,
    Result: exam.r,
    'Answer Key': exam.k,
  };
  const targetUrl =
    mapKey[processType] ||
    (boardInfo.u2 && boardInfo.u2[processType]) ||
    boardInfo.url ||
    exam.u;

  const processDisplay =
    language === 'hi'
      ? processType === 'Apply Online'
        ? 'ऑनलाइन आवेदन'
        : processType === 'Admit Card'
        ? 'एडमिट कार्ड'
        : processType === 'Result'
        ? 'रिजल्ट'
        : 'उत्तर कुंजी'
      : processType;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {language === 'hi' ? 'आधिकारिक प्रक्रिया गाइड' : 'Official Guide'}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{boardName}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-rose-950 dark:text-white mt-0.5">
              {processDisplay} – {displayName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Things Needed Checklist */}
        {reqSource.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-2.5">
              <ClipboardCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>
                {language === 'hi'
                  ? 'शुरू करने से पहले आवश्यक दस्तावेज (चेकलिस्ट):'
                  : 'Things Needed Before You Proceed:'}
              </span>
            </div>
            <div className="space-y-2">
              {reqSource.map((item, idx) => {
                const isChecked = !!checkedItems[item];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleCheck(item)}
                    className="w-full flex items-start gap-2.5 text-left text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span className={isChecked ? 'line-through text-slate-400' : ''}>{item}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-2.5 italic">
              {language === 'hi'
                ? 'दस्तावेज तैयार होने पर टिक करें। सब कुछ आपके ब्राउज़र में सुरक्षित रहता है।'
                : 'Tap items as you arrange them. Everything is stored locally.'}
            </p>
          </div>
        )}

        {/* Step-by-Step Instructions */}
        <div className="mt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            {language === 'hi' ? 'आधिकारिक चरणबद्ध प्रक्रिया:' : 'Official Step-by-Step Procedure:'}
          </h4>
          <ol className="space-y-3">
            {stepsSource.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                <span className="flex-none w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[11px] font-bold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-3 text-[11px] text-slate-400 dark:text-slate-500 italic">
            {language === 'hi'
              ? '* आयोग समय-समय पर पोर्टल लेआउट बदलते हैं। आधिकारिक विज्ञापन पीडीएफ के निर्देशों की भी पुष्टि करें।'
              : '* Portal layouts update periodically. Always verify instructions on the official notification PDF.'}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-rose-950 font-bold text-sm text-center flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 cursor-pointer"
          >
            <span>
              {language === 'hi'
                ? `आधिकारिक ${processDisplay} पेज खोलें`
                : `Open Official ${processType} Page`}
            </span>
            <ExternalLink className="w-4 h-4" />
          </a>
          {exam.o === 'Staff Selection Commission' && processType === 'Result' && (
            <a
              href="https://ssc.gov.in/login"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-semibold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <span>
                {language === 'hi'
                  ? 'व्यक्तिगत स्कोरकार्ड / अंक हेतु SSC लॉगिन खोलें'
                  : 'Open SSC Candidate Login (Scorecard / Marks)'}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'गाइड बंद करें' : 'Close Guide'}
          </button>
        </div>
      </div>
    </div>
  );
};
