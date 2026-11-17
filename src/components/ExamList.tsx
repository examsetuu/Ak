import React from 'react';
import { Search, X, Bookmark, FileText, ArrowUpRight, GraduationCap, Layers } from 'lucide-react';
import { ExamItem, ExamCategory, QualificationLevel, Language, ProcessType } from '../types/exam';
import { EXAM_CATEGORIES, CATEGORY_ALIASES } from '../data/exams';
import { TRANSLATIONS, QUALIFICATION_LABELS, CATEGORY_LABELS } from '../data/translations';

interface ExamListProps {
  exams: ExamItem[];
  selectedCategory: ExamCategory;
  onSelectCategory: (cat: ExamCategory) => void;
  selectedQualification: QualificationLevel;
  onSelectQualification: (qual: QualificationLevel) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelectExam: (exam: ExamItem) => void;
  onOpenProcessGuide: (exam: ExamItem, process: ProcessType) => void;
  bookmarkedExams: string[];
  onToggleBookmark: (examName: string) => void;
  onlyBookmarked: boolean;
  onToggleOnlyBookmarked: () => void;
  language: Language;
}

const QUALIFICATIONS_LIST: QualificationLevel[] = [
  'All',
  '10th',
  '12th',
  'Graduate',
  'PostGraduate',
];

type StatusFilter = 'All' | 'Open' | 'AdmitCard' | 'AnswerKey' | 'Result';

export const ExamList: React.FC<ExamListProps> = ({
  exams,
  selectedCategory,
  onSelectCategory,
  selectedQualification,
  onSelectQualification,
  searchTerm,
  onSearchChange,
  onSelectExam,
  onOpenProcessGuide,
  bookmarkedExams,
  onToggleBookmark,
  onlyBookmarked,
  onToggleOnlyBookmarked,
  language,
}) => {
  const [selectedStatus, setSelectedStatus] = React.useState<StatusFilter>('All');
  const t = TRANSLATIONS[language];
  const searchWords = searchTerm.toLowerCase().split(/[^a-z0-9\u0900-\u097F]+/).filter(Boolean);

  const matchesStatusFilter = (exam: ExamItem, filter: StatusFilter): boolean => {
    if (filter === 'All') return true;
    const statusText = `${exam.st || ''} ${exam.st_hi || ''}`.toLowerCase();
    if (filter === 'Open') {
      return (
        exam.sc === 'red' ||
        statusText.includes('application open') ||
        statusText.includes('apply open') ||
        statusText.includes('last date') ||
        statusText.includes('daf-ii') ||
        statusText.includes('closing')
      );
    }
    if (filter === 'AdmitCard') {
      return (
        exam.sc === 'orange' &&
        !statusText.includes('application open')
      );
    }
    if (filter === 'AnswerKey') {
      return exam.sc === 'blue';
    }
    if (filter === 'Result') {
      return exam.sc === 'green';
    }
    return true;
  };

  const filteredExams = exams.filter((exam) => {
    // 1. Bookmark filter
    if (onlyBookmarked && !bookmarkedExams.includes(exam.n)) {
      return false;
    }

    // 2. Qualification filter ("10th Pass", "12th Pass", "Graduate", "Post Graduate")
    if (selectedQualification !== 'All' && exam.q !== selectedQualification) {
      return false;
    }

    // 3. Category filter (UPSC, SSC, Banking, etc.)
    if (selectedCategory !== 'All' && exam.c !== selectedCategory) {
      return false;
    }

    // 4. Live Status filter (Application Open, Admit Card, Answer Key, Result Declared)
    if (!matchesStatusFilter(exam, selectedStatus)) {
      return false;
    }

    // 5. Search query
    if (searchWords.length === 0) return true;

    const haystack = `${exam.n} ${exam.n_hi || ''} ${exam.o} ${exam.o_hi || ''} ${exam.c} ${
      exam.st || ''
    } ${exam.st_hi || ''} ${CATEGORY_ALIASES[exam.c] || ''}`.toLowerCase();

    return searchWords.every((word) => haystack.includes(word));
  });

  const getStatusBadge = (exam: ExamItem) => {
    let text = language === 'hi' && exam.st_hi ? exam.st_hi : exam.st;
    let color = exam.sc;

    if (!text) {
      const n = exam.n;
      if (n.includes('RRB NTPC')) {
        text = t.lastDateBadge;
        color = 'red';
      } else if (n.includes('SSC CGL') || n.includes('RRB ALP') || n.includes('RRB JE') || n.includes('UPSSSC')) {
        text = t.answerKeyBadge;
        color = 'blue';
      } else if (
        n.includes('SSC GD') ||
        n.includes('SSC CHSL') ||
        n.includes('SSC CPO') ||
        n.includes('IBPS RRB') ||
        n.includes('CTET') ||
        n.includes('UGC NET') ||
        n.includes('UPPSC')
      ) {
        text = t.admitCardBadge;
        color = 'orange';
      } else if (
        n.includes('RBI') ||
        n.includes('UPSC') ||
        n.includes('SSC MTS') ||
        n.includes('BPSC') ||
        n.includes('NEET') ||
        n.includes('CUET')
      ) {
        text = t.resultBadge;
        color = 'green';
      } else {
        text = t.appOpenBadge;
        color = 'orange';
      }
    }

    const isRed = color === 'red';
    const isGreen = color === 'green';
    const isBlue = color === 'blue';

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-tight ${
          isRed
            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300/80 dark:border-rose-800'
            : isGreen
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800'
            : isBlue
            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border border-sky-300/80 dark:border-sky-800'
            : 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {text}
      </span>
    );
  };

  const getQualBadge = (qual: QualificationLevel) => {
    const lbl = QUALIFICATION_LABELS[qual]?.[language] || qual;
    const is10th = qual === '10th';
    const is12th = qual === '12th';
    const isGrad = qual === 'Graduate';

    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${
          is10th
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800'
            : is12th
            ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800'
            : isGrad
            ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
            : 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800'
        }`}
      >
        <GraduationCap className="w-3 h-3" />
        <span>{lbl}</span>
      </span>
    );
  };

  return (
    <section id="exams-list" className="space-y-6 w-full max-w-full min-w-0 box-border">
      {/* Search Input Bar */}
      <div className="relative w-full max-w-full min-w-0">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full max-w-full box-border pl-12 pr-10 py-3.5 sm:py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* DUAL FILTER STATION: Feature 1 - Qualification Filter + Feature 2 - Category Filter */}
      <div className="space-y-3.5 w-full max-w-full min-w-0 box-border bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
        {/* ROW 1: Filter by Qualification (10th Pass, 12th Pass, Graduate) */}
        <div className="min-w-0 max-w-full">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 mb-2">
            <GraduationCap className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{t.filterByQualification}</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full max-w-full min-w-0">
            {QUALIFICATIONS_LIST.map((qual) => {
              const active = selectedQualification === qual;
              const label = QUALIFICATION_LABELS[qual]?.[language] || qual;
              return (
                <button
                  key={qual}
                  onClick={() => onSelectQualification(qual)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    active
                      ? 'bg-amber-500 text-rose-950 font-bold shadow-sm ring-1 ring-amber-600'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 min-w-0 max-w-full">
          {/* ROW 2: Filter by Category / Board */}
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            <Layers className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400 shrink-0" />
            <span>{t.filterByCategory}</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full max-w-full min-w-0">
            {EXAM_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat && !onlyBookmarked;
              const label = CATEGORY_LABELS[cat]?.[language] || cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    if (onlyBookmarked) onToggleOnlyBookmarked();
                    onSelectCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    active
                      ? 'bg-rose-900 text-white shadow-sm ring-1 ring-amber-400'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400'
                  }`}
                >
                  {label}
                </button>
              );
            })}

            {/* Bookmarks Toggle Tab */}
            <button
              onClick={onToggleOnlyBookmarked}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1.5 ${
                onlyBookmarked
                  ? 'bg-amber-500 text-rose-950 font-bold shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-current' : ''}`} />
              <span>
                {t.saved} ({bookmarkedExams.length})
              </span>
            </button>
          </div>
        </div>

        {/* Divider & ROW 3: Filter by Live Status */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 min-w-0 max-w-full">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
            <span>{t.filterByStatus}</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full max-w-full min-w-0">
            {(
              [
                { id: 'All', label: t.statusAll },
                { id: 'Open', label: t.statusOpen },
                { id: 'AdmitCard', label: t.statusAdmit },
                { id: 'AnswerKey', label: t.statusKey },
                { id: 'Result', label: t.statusResult },
              ] as { id: StatusFilter; label: string }[]
            ).map((statusOption) => {
              const active = selectedStatus === statusOption.id;
              return (
                <button
                  key={statusOption.id}
                  onClick={() => setSelectedStatus(statusOption.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    active
                      ? 'bg-rose-900 text-white shadow-sm ring-1 ring-amber-400'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400'
                  }`}
                >
                  {statusOption.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Count and metadata summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="font-mono tabular-nums">
            {filteredExams.length} {filteredExams.length === 1 ? t.examFound : t.examsFound}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span>{t.verifiedBadge}</span>
            <span aria-hidden="true">·</span>
            <span>{t.govtPortalsOnly}</span>
          </div>
        </div>
      </div>

      {/* Exam Grid */}
      {filteredExams.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
            {t.noExamFound} {searchTerm ? `"${searchTerm}"` : ''}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'hi'
              ? 'कृपया दूसरा नाम, 10वीं/12वीं/स्नातक योग्यता या फ़िल्टर बदल कर देखें।'
              : 'Try searching for another exam name, qualification level, or clear your filters.'}
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              onSelectCategory('All');
              onSelectQualification('All');
              setSelectedStatus('All');
              if (onlyBookmarked) onToggleOnlyBookmarked();
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-rose-900 text-white text-xs font-semibold hover:bg-rose-950 transition-colors cursor-pointer"
          >
            {t.clearFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-full min-w-0">
          {filteredExams.map((exam, idx) => {
            const isBookmarked = bookmarkedExams.includes(exam.n);
            const displayName = language === 'hi' && exam.n_hi ? exam.n_hi : exam.n;
            const displayOrg = language === 'hi' && exam.o_hi ? exam.o_hi : exam.o;

            return (
              <div
                key={idx}
                className="group relative w-full max-w-full min-w-0 box-border bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 text-left border-l-4 border-l-amber-500 hover:border-amber-400 dark:hover:border-amber-500 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div className="min-w-0">
                  {/* Top row: Category, Qualification badge & Bookmark button */}
                  <div className="flex items-start justify-between gap-2 mb-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 min-w-0">
                      <span className="font-semibold text-rose-700 dark:text-rose-400">
                        {displayOrg}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{exam.c}</span>
                      <span aria-hidden="true">·</span>
                      {getQualBadge(exam.q)}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(exam.n);
                      }}
                      className="p-1.5 -mr-1.5 -mt-1.5 text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer shrink-0"
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark exam'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* Exam Name */}
                  <button
                    onClick={() => onSelectExam(exam)}
                    className="block text-left w-full group-hover:text-rose-900 dark:group-hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug break-words">
                      {displayName}
                    </h3>
                  </button>

                  {/* Status Badge */}
                  <div className="mt-2.5 max-w-full">{getStatusBadge(exam)}</div>
                </div>

                {/* Card Action Strip */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectExam(exam)}
                    className="text-xs font-bold text-rose-800 dark:text-rose-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>{t.viewDates}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenProcessGuide(exam, 'Apply Online')}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60 transition-colors cursor-pointer"
                      title="Step-by-step apply guide and required checklist"
                    >
                      {t.applyGuide}
                    </button>
                    {exam.f && (
                      <a
                        href={exam.f}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title={t.officialNotificationPdf}
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
