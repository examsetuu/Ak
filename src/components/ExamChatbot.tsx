import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Globe,
  BookOpen,
  Zap,
  ExternalLink,
  Trash2,
  Copy,
  Check,
  Bot,
  User,
  AlertCircle,
} from 'lucide-react';
import { Language } from '../types/exam';
import { INITIAL_EXAMS } from '../data/exams';

export type ChatRoleMode = 'search_advisor' | 'strategy_coach' | 'quick_tutor';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: GroundingSource[];
  modelUsed?: string;
  fallbackNote?: string;
  isError?: boolean;
}

function buildLocalVerifiedFallback(
  query: string,
  quotaMsg: string,
  language: Language
): { text: string; sources: GroundingSource[] } {
  const q = query.toLowerCase();
  const stopWords = new Set([
    'exam',
    'date',
    'dates',
    'status',
    'latest',
    'check',
    'for',
    'and',
    'the',
    'via',
    'with',
    'official',
    'updates',
    'update',
  ]);
  const tokens = q
    .split(/[\s,/?()]+/)
    .filter((tok) => tok.length >= 2 && !stopWords.has(tok));

  const matched = INITIAL_EXAMS.filter((exam) => {
    const haystack = `${exam.n} ${exam.n_hi || ''} ${exam.o} ${exam.c} ${exam.st}`.toLowerCase();
    return tokens.some((tok) => haystack.includes(tok));
  }).slice(0, 3);

  const sources: GroundingSource[] = [];
  const lines: string[] = [
    `**${language === 'hi' ? 'सूचना (API कोटा सीमा):' : 'API Quota Notice:'}** ${quotaMsg}`,
  ];

  if (matched.length > 0) {
    lines.push(
      '',
      language === 'hi'
        ? '**ExamSetu & Toolkit के स्थानीय सत्यापित डेटाबेस से उपलब्ध जानकारी:**'
        : '**Verified Exam Details from Local ExamSetu & Toolkit Catalog:**'
    );
    for (const ex of matched) {
      const name = language === 'hi' && ex.n_hi ? ex.n_hi : ex.n;
      const status = language === 'hi' && ex.st_hi ? ex.st_hi : ex.st;
      lines.push(`- **${name}** (${ex.o}) — ${status}`);
      if (ex.d?.dates && ex.d.dates.length > 0) {
        const dRows = language === 'hi' && ex.d.dates_hi ? ex.d.dates_hi : ex.d.dates;
        for (const [label, val] of dRows.slice(0, 3)) {
          lines.push(`  - ${label}: ${val}`);
        }
      }
      if (ex.u) sources.push({ title: `${ex.n} Official Portal`, uri: ex.u });
      if (ex.a && ex.a !== ex.u) sources.push({ title: `${ex.n} Admit Card`, uri: ex.a });
      if (ex.r && ex.r !== ex.u) sources.push({ title: `${ex.n} Result`, uri: ex.r });
    }
  } else if (
    q.includes('photo') ||
    q.includes('sign') ||
    q.includes('kb') ||
    q.includes('फोटो') ||
    q.includes('हस्ताक्षर')
  ) {
    lines.push(
      '',
      language === 'hi'
        ? '**फोटो व हस्ताक्षर मानक (स्थानीय गाइड):**\n- **SSC**: फोटो (20–50 KB, सफेद बैकग्राउंड) व हस्ताक्षर (10–20 KB, 4×2 सेमी JPG)।\n- **IBPS / SBI**: फोटो (20–50 KB, 200×230 px), हस्ताक्षर (10–20 KB), बायां अंगूठा व हस्तलिखित घोषणा।\n- नीचे पेज पर **Student Form Utility Station** में Photo & Sign Resizer से 100% ऑफलाइन तैयार करें।'
        : '**Standard Photo & Signature Specs (Local Guide):**\n- **SSC**: Photograph (20–50 KB, plain light background) & Signature (10–20 KB, 4.0×2.0 cm JPG).\n- **IBPS / SBI**: Photograph (20–50 KB, 200×230 px), Signature (10–20 KB), plus Left Thumb Impression & Handwritten Declaration.\n- Use the **Photo & Sign Resizer** right below on this page to format files 100% offline.'
    );
  } else {
    lines.push(
      '',
      language === 'hi'
        ? `आप पेज के मुख्य फ़िल्टर से सभी ${INITIAL_EXAMS.length} परीक्षाओं की ताजा तिथियां, एडमिट कार्ड, उत्तर कुंजी, रिजल्ट और फोटो/आयु/PDF टूल्स का उपयोग बिना किसी API कोटा के कर सकते हैं।`
        : 'You can browse live exam dates, admit cards, answer keys, results, and use the offline Photo Resizer, Age Calculator & PDF Compressor directly on the page without API quota.'
    );
  }

  return { text: lines.join('\n'), sources: sources.slice(0, 6) };
}

interface ExamChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  pendingPrompt?: string | null;
  onClearPendingPrompt?: () => void;
}

const ROLE_OPTIONS: Array<{
  id: ChatRoleMode;
  labelEn: string;
  labelHi: string;
  badge: string;
  descEn: string;
  descHi: string;
  icon: 'globe' | 'book' | 'zap';
}> = [
  {
    id: 'search_advisor',
    labelEn: 'Live Exam Search',
    labelHi: 'लाइव परीक्षा सर्च',
    badge: 'Google Search',
    descEn: 'Verifies live exam dates, admit cards & results via Google Search',
    descHi: 'गूगल सर्च से ताजा परीक्षा तिथि, एडमिट कार्ड व रिजल्ट जांचें',
    icon: 'globe',
  },
  {
    id: 'strategy_coach',
    labelEn: 'Study Coach',
    labelHi: 'सिलेबस व रणनीति',
    badge: 'Strategy + Search',
    descEn: 'Syllabus breakdown, cutoff analysis & daily study plans',
    descHi: 'पाठ्यक्रम विश्लेषण, कट-ऑफ ट्रेंड और तैयारी की योजना',
    icon: 'book',
  },
  {
    id: 'quick_tutor',
    labelEn: 'Fast Form Helper',
    labelHi: 'तेज़ फॉर्म गाइड',
    badge: 'Instant',
    descEn: 'Rapid answers on photo/sign KB size, age & document rules',
    descHi: 'फोटो/हस्ताक्षर साइज, आयु छूट व दस्तावेज नियमों पर तुरंत उत्तर',
    icon: 'zap',
  },
];

const STARTER_PROMPTS = {
  en: [
    'Check latest SSC CGL, GD & CHSL official updates and dates',
    'What photo & signature size is required for SSC and IBPS forms?',
    'Share a 30-day revision strategy and expected cutoffs for RRB NTPC',
    'How do I check my UPSC / SSC / IBPS eligibility & age relaxation?',
  ],
  hi: [
    'SSC CGL, GD और CHSL की नवीनतम आधिकारिक तिथियां जांचें',
    'SSC और IBPS फॉर्म के लिए फोटो व हस्ताक्षर का सही साइज क्या है?',
    'RRB NTPC के लिए 30 दिन की तैयारी रणनीति और कट-ऑफ बताएं',
    'सरकारी परीक्षाओं में OBC / SC / ST / EWS आयु छूट कैसे लागू होती है?',
  ],
};

function renderFormattedLine(line: string): React.ReactNode {
  const tokenRegex = /(\[[^\]]+\]\(https?:\/\/[^)\s]+\)|\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`)/g;
  const parts = line.split(tokenRegex);
  return parts.map((part, idx) => {
    const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={idx}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-rose-700 dark:text-amber-300 underline font-semibold hover:text-rose-900 dark:hover:text-amber-200 break-words"
        >
          {linkMatch[1]}
        </a>
      );
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-bold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={idx} className="italic text-slate-600 dark:text-slate-300">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={idx}
          className="px-1 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700/70 font-mono text-[11px]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function FormattedMessageText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;
        if (trimmed === '---' || trimmed === '***') {
          return <hr key={i} className="border-slate-200 dark:border-slate-800 my-2" />;
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={i} className="font-bold text-rose-900 dark:text-amber-300 text-xs sm:text-sm pt-1">
              {renderFormattedLine(trimmed.slice(4))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={i} className="font-extrabold text-rose-950 dark:text-amber-200 text-sm pt-1">
              {renderFormattedLine(trimmed.slice(3))}
            </h3>
          );
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={i} className="flex items-start gap-2 pl-1">
              <span className="text-amber-500 font-bold mt-0.5">•</span>
              <span>{renderFormattedLine(trimmed.slice(2))}</span>
            </div>
          );
        }
        return <p key={i}>{renderFormattedLine(line)}</p>;
      })}
    </div>
  );
}

interface ChatThreadProps {
  messages: ChatMessage[];
  isLoading: boolean;
  roleMode: ChatRoleMode;
  language: Language;
  copiedId: string | null;
  onCopy: (id: string, text: string) => void;
  onStarterPrompt: (promptText: string) => void;
  threadEndRef: React.RefObject<HTMLDivElement | null>;
}

const ChatThread = React.memo<ChatThreadProps>(
  ({
    messages,
    isLoading,
    roleMode,
    language,
    copiedId,
    onCopy,
    onStarterPrompt,
    threadEndRef,
  }) => (
    <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4 bg-slate-50/70 dark:bg-slate-950/60">
      {messages.length === 0 ? (
        <div className="py-4 space-y-5">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 text-rose-900 dark:text-amber-400 font-bold text-sm mb-1.5">
              <Bot className="w-4 h-4 shrink-0" />
              <span>
                {language === 'hi'
                  ? 'नमस्ते! ExamSetu & Toolkit AI में आपका स्वागत है'
                  : 'Welcome to ExamSetu & Toolkit AI Assistant'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'सरकारी परीक्षाओं की ताजा तिथियां, एडमिट कार्ड, उत्तर कुंजी, कट-ऑफ या फोटो/PDF फॉर्म नियमों के बारे में कोई भी प्रश्न पूछें। "लाइव परीक्षा सर्च" मोड ताजा जानकारी के लिए Google Search का उपयोग करता है।'
                : 'Ask multi-turn questions about live government exam dates, admit cards, answer keys, cutoffs, study plans, or photo/signature KB rules. Live Exam Search grounds answers with real-time Google Search results.'}
            </p>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {language === 'hi' ? 'त्वरित उदाहरण प्रश्न:' : 'Try asking:'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STARTER_PROMPTS[language].map((promptText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onStarterPrompt(promptText)}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 text-left text-xs text-slate-700 dark:text-slate-200 font-medium transition-colors cursor-pointer shadow-2xs"
                >
                  {promptText}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isUser
                    ? 'bg-rose-900 text-amber-300'
                    : msg.isError
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-amber-500 text-rose-950'
                }`}
              >
                {isUser ? (
                  <User className="w-4 h-4" />
                ) : msg.isError ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm shadow-2xs ${
                  isUser
                    ? 'bg-rose-900 text-white rounded-tr-xs'
                    : msg.isError
                    ? 'bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-tl-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-xs'
                }`}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                ) : (
                  <>
                    {msg.fallbackNote && (
                      <div className="mb-2 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-[11px] text-amber-800 dark:text-amber-300">
                        {msg.fallbackNote}
                      </div>
                    )}
                    <FormattedMessageText text={msg.text} />
                  </>
                )}

                {!isUser && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        {language === 'hi' ? 'सत्यापित वेब स्रोत (Google Search):' : 'Verified Web Sources:'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.slice(0, 6).map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-rose-800 dark:text-amber-300 max-w-[240px] truncate transition-colors"
                          title={src.title}
                        >
                          <span className="truncate">{src.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {!isUser && !msg.isError && (
                  <div className="mt-2 pt-1.5 flex items-center justify-between gap-2 text-[10px] text-slate-400">
                    <span>{msg.modelUsed ? `Model: ${msg.modelUsed}` : ''}</span>
                    <button
                      type="button"
                      onClick={() => onCopy(msg.id, msg.text)}
                      className="inline-flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>{language === 'hi' ? 'कॉपी किया गया' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{language === 'hi' ? 'कॉपी करें' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}

      {isLoading && (
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-rose-950 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 animate-pulse" />
          </div>
          <div className="px-4 py-3 rounded-2xl rounded-tl-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
            <span>
              {roleMode === 'quick_tutor'
                ? language === 'hi'
                  ? 'उत्तर तैयार हो रहा है...'
                  : 'Generating instant answer...'
                : language === 'hi'
                ? 'Google Search से जानकारी जांची जा रही है...'
                : 'Searching live exam updates & preparing answer...'}
            </span>
          </div>
        </div>
      )}
      <div ref={threadEndRef} />
    </div>
  )
);

export const ExamChatbot: React.FC<ExamChatbotProps> = ({
  isOpen,
  onClose,
  language,
  pendingPrompt,
  onClearPendingPrompt,
}) => {
  const [roleMode, setRoleMode] = useState<ChatRoleMode>('search_advisor');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const sendMessageText = async (rawText: string, overrideRole?: ChatRoleMode) => {
    const trimmed = rawText.trim();
    if (!trimmed || isLoading) return;

    const activeRole = overrideRole || roleMode;
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages = nextHistory
        .filter((m) => !m.isError)
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          roleMode: activeRole,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429 || data?.quotaExhausted) {
          const fallback = buildLocalVerifiedFallback(
            trimmed,
            data?.error || 'Gemini API quota exceeded.',
            language
          );
          setMessages((prev) => [
            ...prev,
            {
              id: `q_${Date.now()}`,
              role: 'model',
              text: fallback.text,
              sources: fallback.sources,
              modelUsed: 'Local Verified Catalog',
            },
          ]);
          return;
        }
        throw new Error(data?.error || 'Failed to get response from AI Assistant.');
      }

      const botMsg: ChatMessage = {
        id: `m_${Date.now()}`,
        role: 'model',
        text: data.reply,
        sources: Array.isArray(data.sources) ? data.sources : [],
        modelUsed: data.modelUsed,
        fallbackNote: data.fallbackNote,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const errText =
        err instanceof Error ? err.message : 'Network error while contacting ExamSetu & Toolkit AI.';
      setMessages((prev) => [
        ...prev,
        {
          id: `e_${Date.now()}`,
          role: 'model',
          text: errText,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger auto-send when opened via ExamDetailModal's "Verify Live via AI Search"
  useEffect(() => {
    if (isOpen && pendingPrompt && !isLoading) {
      setRoleMode('search_advisor');
      void sendMessageText(pendingPrompt, 'search_advisor');
      onClearPendingPrompt?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, pendingPrompt]);

  const handleCopy = React.useCallback((id: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  }, []);

  const handleStarterPrompt = React.useCallback(
    (promptText: string) => {
      void sendMessageText(promptText);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [roleMode, language, isLoading, messages]
  );

  if (!isOpen) return null;

  const activeRoleMeta = ROLE_OPTIONS.find((r) => r.id === roleMode) || ROLE_OPTIONS[0];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessageText(input);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 border-t-4 sm:border sm:border-t-4 border-amber-500 rounded-t-3xl sm:rounded-2xl max-w-2xl w-full h-[92dvh] sm:h-[82dvh] max-h-full flex flex-col shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:px-5 sm:py-4 bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white border-b border-amber-500/30 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-rose-950 flex items-center justify-center shadow-xs shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>ExamSetu &amp; Toolkit AI</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {activeRoleMeta.badge}
                  </span>
                </h2>
                <p className="text-[11px] sm:text-xs text-rose-200/90">
                  {language === 'hi' ? activeRoleMeta.descHi : activeRoleMeta.descEn}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-rose-100 hover:text-white transition-colors cursor-pointer"
                  title={language === 'hi' ? 'चैट साफ़ करें' : 'Clear conversation'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close AI Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {ROLE_OPTIONS.map((opt) => {
              const isSelected = roleMode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRoleMode(opt.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-rose-950 shadow-xs'
                      : 'bg-white/10 text-rose-100 hover:bg-white/20'
                  }`}
                >
                  {opt.icon === 'globe' && <Globe className="w-3.5 h-3.5" />}
                  {opt.icon === 'book' && <BookOpen className="w-3.5 h-3.5" />}
                  {opt.icon === 'zap' && <Zap className="w-3.5 h-3.5" />}
                  <span>{language === 'hi' ? opt.labelHi : opt.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Thread (Memoized so typing never re-renders chat messages) */}
        <ChatThread
          messages={messages}
          isLoading={isLoading}
          roleMode={roleMode}
          language={language}
          copiedId={copiedId}
          onCopy={handleCopy}
          onStarterPrompt={handleStarterPrompt}
          threadEndRef={threadEndRef}
        />

        {/* Input Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessageText(input);
          }}
          className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0"
        >
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                language === 'hi'
                  ? 'परीक्षा तिथि, एडमिट कार्ड, कट-ऑफ या फोटो साइज के बारे में पूछें...'
                  : 'Ask about live exam dates, admit cards, cutoffs, or form rules...'
              }
              className="flex-1 resize-none rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-base sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-11 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-rose-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'hi' ? 'भेजें' : 'Send'}</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 text-center">
            {language === 'hi'
              ? 'AI द्वारा प्राप्त जानकारी की पुष्टि हमेशा संबंधित आयोग की आधिकारिक वेबसाइट पर करें।'
              : 'Always verify final dates and rules on official commission portals.'}
          </p>
        </form>
      </div>
    </div>
  );
};
