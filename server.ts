import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import type { Content, GenerateContentConfig } from '@google/genai';

type ChatRoleMode = 'search_advisor' | 'strategy_coach' | 'quick_tutor';

interface IncomingChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface GroundingSource {
  title: string;
  uri: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

const getAiClient = (): GoogleGenAI | null => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const buildRoleConfig = (
  roleMode: ChatRoleMode,
  language: 'en' | 'hi'
): { model: string; config: GenerateContentConfig } => {
  const langInstruction =
    language === 'hi'
      ? 'Respond in clear, natural Hindi (Devanagari script) unless the user writes purely in English, keeping exam acronyms (SSC, UPSC, IBPS, RRB, PDF, KB) easy to read.'
      : 'Respond in clear, structured English unless the user explicitly asks in Hindi.';

  const commonBoundary = [
    'Current Reference Date: November 16, 2026 (2026–2027 Indian exam cycle). Never output outdated 2024 dates as current.',
    'Verified ExamSetu & Toolkit Snapshot (Nov 16, 2026): RRB NTPC UG CEN 07/2026 Correction Window Open (16–25 Nov; Graduate correction till 18 Nov); RRB ALP CBT-1 Answer Key Out (objections open till 19/11/2026); SSC CPO City Intimation Slip Out (13/11/2026, exam 23–28 Nov 2026); SSC GD PET/PST Admit Card Out (12/11/2026, physical 26/11–11/12/2026); UPSC CSE DAF-II Open till 25/11/2026; IBPS RRB PO Prelims 21–22 Nov 2026; SBI Clerk Mains 26/11/2026; JEE Main 2027 Session-1 Apply Open till 22/11/2026; State Exams (Bihar/UP/JH/MP/RJ/HR/PB): UP Police Constable Normalized Scorecard Active (16 Nov–15 Dec), MPPSC ADPO Final Key Out (16 Nov), MPESB Police Constable Exam starts 19 Nov, UPPSC PCS & RPSC RAS Prelims 06 Dec, RSSB 12th CET 01–03 Dec, BPSC TRE 4.0 closed 03 Nov, BSSC 2nd Inter (26,426) & CGL-4 awaiting dates, PPSC PCS Mains Result Out (04 Nov), HPSC HCS 2026 marks out, JPSC/JSSC & HSSC/PSSSB updates active.',
    'You are part of ExamSetu & Toolkit, an independent Indian government exam information portal and student utility platform. Never claim affiliation with any government agency, and always advise candidates to cross-verify final deadlines on official portals like ssc.gov.in, upsc.gov.in, ibps.in, sbi.bank.in, rrbapply.gov.in, or state PSC portals. Keep responses concise, scannable, and well-formatted with bullet points.',
  ].join('\n');

  if (roleMode === 'quick_tutor') {
    return {
      model: 'gemini-3.1-flash-lite',
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        systemInstruction: [
          'Role: ExamSetu & Toolkit Fast Form & Document Utility Helper.',
          'Specialize in instant, practical answers about Indian exam application form rules: photo/signature pixel & KB limits, white-background & Name/DOP stamp requirements, OBC-NCL/EWS/SC/ST certificate validity rules, age limit & category relaxations, and PDF document compression under 300 KB, plus quick formula/reasoning tips. Remind users they can use the built-in Photo & Sign Resizer, Age Calculator, and Photo to PDF tools right on this page (100% private in browser).',
          langInstruction,
          commonBoundary,
        ].join('\n\n'),
      },
    };
  }

  if (roleMode === 'strategy_coach') {
    return {
      model: 'gemini-4-hydrogen',
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        systemInstruction: [
          'Role: ExamSetu & Toolkit Syllabus, Pattern & Study Strategy Coach.',
          'Specialize in exam syllabi, tier-wise selection schemes, subject weightage, mock test strategy, revision timetables, and previous cutoff trends across SSC, UPSC, Banking, Railway, Defence, Teaching, and State PSC exams. Use Google Search grounding whenever referencing current exam patterns or latest syllabus updates.',
          langInstruction,
          commonBoundary,
        ].join('\n\n'),
      },
    };
  }

  return {
    model: 'gemini-4-hydrogen',
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: [
        'Role: ExamSetu & Toolkit Live Official Exam Verification Assistant.',
        'Use Google Search grounding to check the most up-to-date official recruitment notifications, application open/last dates, admit card releases, answer key objection windows, result declarations, and official commission URLs in India.',
        'Always mention exact official dates and official portal URLs when found via search. If a date is tentative or not yet officially announced, state that transparently.',
        langInstruction,
        commonBoundary,
      ].join('\n\n'),
    },
  };
};

const normalizeHistory = (messages: IncomingChatMessage[]): Content[] => {
  const valid = messages.filter(
    (m) => (m.role === 'user' || m.role === 'model') && typeof m.text === 'string' && m.text.trim().length > 0
  );

  // History passed to ai.chats.create must start with a 'user' turn and alternate user/model
  const firstUserIndex = valid.findIndex((m) => m.role === 'user');
  if (firstUserIndex === -1) return [];

  const sliced = valid.slice(firstUserIndex);
  const alternating: Content[] = [];

  for (const msg of sliced) {
    const prev = alternating[alternating.length - 1];
    if (prev && prev.role === msg.role) {
      // Merge consecutive messages of the same role to preserve strict alternation
      const prevText = prev.parts?.[0]?.text ?? '';
      prev.parts = [{ text: `${prevText}\n\n${msg.text.trim()}` }];
    } else {
      alternating.push({
        role: msg.role,
        parts: [{ text: msg.text.trim() }],
      });
    }
  }

  return alternating;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRateLimitOrQuotaError = (error: unknown): boolean => {
  const msg = error instanceof Error ? error.message : String(error);
  return msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429');
};

const isAuthOrKeyError = (error: unknown): boolean => {
  const msg = error instanceof Error ? error.message : String(error);
  return msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED') || msg.includes('403');
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'examsetu-and-toolkit' });
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const ai = getAiClient();
      if (!ai) {
        return res.status(500).json({
          error:
            'GEMINI_API_KEY is missing on the server. Add it in the AI Studio Settings > Secrets panel to enable live AI exam help.',
        });
      }

      const rawMessages = Array.isArray(req.body?.messages)
        ? (req.body.messages as IncomingChatMessage[])
        : [];
      const roleMode: ChatRoleMode =
        req.body?.roleMode === 'quick_tutor' || req.body?.roleMode === 'strategy_coach'
          ? req.body.roleMode
          : 'search_advisor';
      const language: 'en' | 'hi' = req.body?.language === 'hi' ? 'hi' : 'en';

      const normalized = normalizeHistory(rawMessages);
      if (normalized.length === 0 || normalized[normalized.length - 1].role !== 'user') {
        return res.status(400).json({
          error: 'Please enter a valid question for the exam assistant.',
        });
      }

      const latestTurn = normalized[normalized.length - 1];
      const latestText = latestTurn.parts?.[0]?.text ?? '';
      const priorHistory = normalized.slice(0, -1);

      const primary = buildRoleConfig(roleMode, language);

      // Build ordered fallback attempts so 429 quota limits or empty responses recover cleanly
      const attempts: Array<{ model: string; config: GenerateContentConfig; note?: string }> = [
        { model: primary.model, config: primary.config },
      ];

      if (primary.model !== 'gemini-3.1-flash-lite') {
        attempts.push({
          model: 'gemini-3.1-flash-lite',
          config: {
            tools: [{ googleSearch: {} }],
            thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
            systemInstruction: primary.config.systemInstruction,
          },
          note:
            language === 'hi'
              ? 'लाइव सर्च बैकअप मॉडल (gemini-3.1-flash-lite) का उपयोग किया गया।'
              : 'Live Google Search powered via fast fallback model (gemini-3.1-flash-lite).',
        });

        const lite = buildRoleConfig('quick_tutor', language);
        attempts.push({
          model: lite.model,
          config: lite.config,
          note:
            language === 'hi'
              ? 'लाइव गूगल सर्च कोटा व्यस्त होने के कारण तेज़ बैकअप सहायक का उपयोग किया गया।'
              : 'Live Google Search quota is busy; answered using fast assistant.',
        });
      }

      let lastError: unknown = null;
      let response: Awaited<ReturnType<ReturnType<typeof ai.chats.create>['sendMessage']>> | null =
        null;
      let usedModel = primary.model;
      let fallbackNote: string | undefined;

      for (let i = 0; i < attempts.length; i++) {
        const attempt = attempts[i];
        try {
          if (i > 0) await sleep(350);
          const chat = ai.chats.create({
            model: attempt.model,
            history: priorHistory,
            config: attempt.config,
          });
          const candidate = await chat.sendMessage({ message: latestText });
          if (candidate.text && candidate.text.trim().length > 0) {
            response = candidate;
            usedModel = attempt.model;
            fallbackNote = attempt.note;
            break;
          }
        } catch (err: unknown) {
          lastError = err;
          if (!isRateLimitOrQuotaError(err)) {
            throw err;
          }
        }
      }

      if (!response) {
        if (isRateLimitOrQuotaError(lastError)) {
          console.warn('[/api/chat] Gemini API quota/rate limit reached (429 RESOURCE_EXHAUSTED).');
          return res.status(429).json({
            quotaExhausted: true,
            error:
              language === 'hi'
                ? 'आपकी Gemini API कुंजी का फ्री कोटा समाप्त हो गया है या रेट लिमिट पूरी हो गई है। अधिक कोटा के लिए AI Studio में Settings > Secrets से बिलिंग-सक्रिय API कुंजी चुनें।'
                : 'Gemini API quota or rate limit exceeded on the active key. Upgrading to a billing-enabled API key in Settings > Secrets increases your quota.',
          });
        }
        if (lastError) throw lastError;
        return res.status(502).json({
          error: 'Assistant returned an empty response. Please try again.',
        });
      }

      const replyText = response.text?.trim() || '';

      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      const rawChunks = groundingMetadata?.groundingChunks ?? [];
      const seenUris = new Set<string>();
      const sources: GroundingSource[] = [];

      for (const chunk of rawChunks) {
        const uri = chunk.web?.uri;
        if (uri && !seenUris.has(uri)) {
          seenUris.add(uri);
          sources.push({
            title: chunk.web?.title || uri,
            uri,
          });
        }
      }

      return res.json({
        reply: replyText,
        sources,
        searchQueries: groundingMetadata?.webSearchQueries ?? [],
        modelUsed: usedModel,
        fallbackNote,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unable to reach Gemini AI service right now.';

      if (isAuthOrKeyError(error)) {
        console.warn('[/api/chat] API key rejected or missing permission (403).');
        return res.status(403).json({
          error:
            'The configured GEMINI_API_KEY was rejected or lacks permission. Please verify your key in Settings > Secrets.',
        });
      }

      if (isRateLimitOrQuotaError(error)) {
        console.warn('[/api/chat] Gemini API quota/rate limit reached (429).');
        return res.status(429).json({
          quotaExhausted: true,
          error:
            'Gemini API quota or rate limit exceeded. Upgrading to a paid tier in Settings > Secrets increases your quota.',
        });
      }

      console.warn('[/api/chat] Request failed:', message);
      return res.status(500).json({
        error: `AI request failed: ${message}`,
      });
    }
  });

  if (!isProduction) {
    const viteModule = await import('vite');
    const vite = await viteModule.createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ExamSetu & Toolkit server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start ExamSetu & Toolkit server:', err);
  process.exit(1);
});
