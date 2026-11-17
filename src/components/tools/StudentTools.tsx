import React, { useState, useRef } from 'react';
import {
  Crop,
  Calculator,
  FileCheck,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { EXAM_DOCS_DATA, AGE_PRESETS_DATA } from '../../data/exams';
import { buildMultiPagePDF } from '../../utils/pdfGenerator';
import { Language } from '../../types/exam';
import { TRANSLATIONS } from '../../data/translations';

interface StudentToolsProps {
  language: Language;
}

export const StudentTools: React.FC<StudentToolsProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  // --- Tool 1: Photo & Sign Resizer State ---
  const [selectedExam, setSelectedExam] = useState('SSC');
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [stampName, setStampName] = useState('');
  const [stampDate, setStampDate] = useState('15/11/2026');
  const [resizerImageFile, setResizerImageFile] = useState<File | null>(null);
  const [resizerResult, setResizerResult] = useState<{
    url: string;
    sizeKB: number;
    w: number;
    h: number;
  } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizerInputRef = useRef<HTMLInputElement>(null);

  // --- Tool 2: Age & Eligibility State ---
  const [agePresetIndex, setAgePresetIndex] = useState(4); // Default SSC CGL
  const [dob, setDob] = useState('2000-05-15');
  const [cutoffDate, setCutoffDate] = useState('2026-08-01');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(30);
  const [catRelaxation, setCatRelaxation] = useState(0);
  const [ageResult, setAgeResult] = useState<{
    years: number;
    months: number;
    days: number;
    eligible: boolean;
    effectiveMax: number;
    minAge: number;
  } | null>(null);

  // --- Tool 3: Photo to PDF State ---
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [targetPdfKB, setTargetPdfKB] = useState(280);
  const [pdfResult, setPdfResult] = useState<{ url: string; sizeKB: number; pages: number } | null>(
    null
  );
  const [isMakingPdf, setIsMakingPdf] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Preset documents
  const docPresets = EXAM_DOCS_DATA[selectedExam] || EXAM_DOCS_DATA['SSC'];
  const currentDocPreset = docPresets[selectedDocIndex] || docPresets[0];

  // Handle Exam change for Tool 1
  const handleExamChange = (examKey: string) => {
    setSelectedExam(examKey);
    setSelectedDocIndex(0);
    setResizerResult(null);
  };

  // Handle Preset change for Tool 2
  const handleAgePresetChange = (idx: number) => {
    setAgePresetIndex(idx);
    const p = AGE_PRESETS_DATA[idx];
    if (p) {
      setMinAge(p.min);
      setMaxAge(p.max);
      setCutoffDate(p.cut);
      setAgeResult(null);
    }
  };

  // Run Photo/Sign Resizer
  const handleResizeAndCompress = () => {
    if (!resizerImageFile) {
      alert('Please select an image file first.');
      return;
    }

    setIsResizing(true);
    const p = currentDocPreset;
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const cv = document.createElement('canvas');
        cv.width = p.w;
        cv.height = p.h;
        const ctx = cv.getContext('2d');
        if (!ctx) return;

        // White background fill
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, p.w, p.h);

        // Name & DOP banner calculation
        const nameTxt = p.photo ? stampName.trim().toUpperCase() : '';
        const dateTxt = p.photo ? stampDate.trim() : '';
        const hasStamp = !!(nameTxt || dateTxt);
        const stripH = hasStamp ? Math.round(p.h * 0.22) : 0;
        const imgAreaH = p.h - stripH;

        // Maintain aspect ratio within image area
        const scale = Math.min(p.w / img.width, imgAreaH / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, (p.w - dw) / 2, (imgAreaH - dh) / 2, dw, dh);

        // Render white name/date banner if requested
        if (stripH > 0) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, imgAreaH, p.w, stripH);
          ctx.strokeStyle = '#CBD5E1';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, imgAreaH);
          ctx.lineTo(p.w, imgAreaH);
          ctx.stroke();

          ctx.fillStyle = '#0F172A';
          ctx.textAlign = 'center';
          const fontSize = Math.max(10, Math.round(stripH * 0.36));
          ctx.font = `bold ${fontSize}px 'Plus Jakarta Sans', Arial, sans-serif`;

          if (nameTxt && dateTxt) {
            ctx.fillText(nameTxt, p.w / 2, imgAreaH + stripH * 0.44, p.w - 8);
            ctx.fillText('DOP: ' + dateTxt, p.w / 2, imgAreaH + stripH * 0.86, p.w - 8);
          } else {
            ctx.fillText(nameTxt || 'DOP: ' + dateTxt, p.w / 2, imgAreaH + stripH * 0.65, p.w - 8);
          }
        }

        // Adaptive compression loop to target maxKB
        let q = 0.94;
        let dataUrl = cv.toDataURL('image/jpeg', q);
        let sizeKB = Math.max(1, Math.round(((dataUrl.length * 3) / 4) / 1024));

        while (sizeKB > p.maxKB && q > 0.12) {
          q -= 0.06;
          dataUrl = cv.toDataURL('image/jpeg', q);
          sizeKB = Math.max(1, Math.round(((dataUrl.length * 3) / 4) / 1024));
        }

        setResizerResult({
          url: dataUrl,
          sizeKB,
          w: p.w,
          h: p.h,
        });
        setIsResizing(false);
      };
      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(resizerImageFile);
  };

  // Run Age Calculator
  const handleCalculateAge = () => {
    if (!dob || !cutoffDate) {
      alert('Please enter both Date of Birth and Cutoff Date.');
      return;
    }

    const dDob = new Date(dob + 'T00:00:00');
    const dCut = new Date(cutoffDate + 'T00:00:00');

    if (dDob > dCut) {
      alert('Date of birth cannot be after the cutoff date.');
      return;
    }

    let yrs = dCut.getFullYear() - dDob.getFullYear();
    let mos = dCut.getMonth() - dDob.getMonth();
    let days = dCut.getDate() - dDob.getDate();

    if (days < 0) {
      mos--;
      const prevMonth = new Date(dCut.getFullYear(), dCut.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (mos < 0) {
      yrs--;
      mos += 12;
    }

    const exactDecimal = yrs + mos / 12 + days / 365.25;
    const effectiveMax = maxAge + catRelaxation;
    const isEligible =
      exactDecimal >= minAge && (yrs < effectiveMax || (yrs === effectiveMax && mos === 0 && days === 0));

    setAgeResult({
      years: yrs,
      months: mos,
      days,
      eligible: isEligible,
      effectiveMax,
      minAge,
    });
  };

  // Run Photo to PDF
  const handleCreatePdf = async () => {
    if (!pdfFiles.length) {
      alert('Please select at least 1 document image.');
      return;
    }

    setIsMakingPdf(true);
    const maxTotalBytes = targetPdfKB * 1024;
    const perImgBytes = Math.floor((maxTotalBytes - 2048) / pdfFiles.length);

    try {
      const pages = await Promise.all(
        pdfFiles.slice(0, 5).map((f) => {
          return new Promise<{ bytes: Uint8Array; w: number; h: number }>((resolve) => {
            const r = new FileReader();
            r.onload = (ev) => {
              const im = new Image();
              im.onload = () => {
                const maxW = 900;
                const scale = Math.min(1, maxW / im.width);
                const w = Math.round(im.width * scale);
                const h = Math.round(im.height * scale);
                const cv = document.createElement('canvas');
                cv.width = w;
                cv.height = h;
                const ctx = cv.getContext('2d');
                if (!ctx) return;

                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(im, 0, 0, w, h);

                let q = 0.82;
                let dUrl = cv.toDataURL('image/jpeg', q);
                while (dUrl.length * 0.75 > perImgBytes && q > 0.15) {
                  q -= 0.08;
                  dUrl = cv.toDataURL('image/jpeg', q);
                }

                const bin = atob(dUrl.split(',')[1]);
                const bytes = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) {
                  bytes[i] = bin.charCodeAt(i);
                }
                resolve({ bytes, w, h });
              };
              im.src = ev.target?.result as string;
            };
            r.readAsDataURL(f);
          });
        })
      );

      const pdfBlob = buildMultiPagePDF(pages);
      const url = URL.createObjectURL(pdfBlob);
      const kb = Math.max(1, Math.round(pdfBlob.size / 1024));

      setPdfResult({
        url,
        sizeKB: kb,
        pages: pages.length,
      });
    } catch (err) {
      alert('Error creating PDF. Please try different images.');
    } finally {
      setIsMakingPdf(false);
    }
  };

  return (
    <section className="mt-12 pt-10 scroll-mt-20 sm:scroll-mt-24 border-t border-slate-200 dark:border-slate-800 w-full max-w-full min-w-0 box-border" id="form-tools">
      <div className="mb-8 min-w-0 max-w-full">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{t.toolsHeading}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-rose-950 dark:text-white mt-1">
          {t.toolsSubheading}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          {language === 'hi'
            ? 'फोटो/हस्ताक्षर को आधिकारिक बोर्ड विनिर्देशों के अनुसार रीसाइज करें, कटऑफ आयु गणना करें, या मार्कशीट को 300 केबी से छोटे पीडीएफ में बदलें। 100% सुरक्षित और आपके ब्राउज़र में निजी।'
            : 'Resize Photo/Signature to exact board guidelines, calculate cutoff eligibility age, or merge marksheets into a certified PDF under 300 KB. 100% private in your browser.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-full min-w-0">
        {/* ================= Tool 1: Photo & Signature Resizer ================= */}
        <div className="w-full max-w-full min-w-0 box-border bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.tool1Title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.tool1Desc}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3.5">
              {/* Exam Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? '1. परीक्षा बोर्ड चुनें' : '1. Conducting Board / Exam'}
                </label>
                <select
                  value={selectedExam}
                  onChange={(e) => handleExamChange(e.target.value)}
                  className="w-full max-w-full min-w-0 box-border py-2 px-3 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="SSC">SSC (CGL / CHSL / MTS / GD / CPO)</option>
                  <option value="UPSC">UPSC (IAS / NDA / CDS / CAPF)</option>
                  <option value="IBPS">IBPS / SBI / RBI (Banking)</option>
                  <option value="RRB">RRB (NTPC / Group D / ALP / JE)</option>
                  <option value="NTA">NTA (NEET / JEE / CUET / UGC NET)</option>
                  <option value="BPSC">BPSC (Bihar PSC)</option>
                  <option value="UPPSC">UPPSC / UPSSSC (Uttar Pradesh)</option>
                  <option value="ARMY">Indian Army Agniveer</option>
                  <option value="CBSE">CBSE / CTET</option>
                </select>
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? '2. दस्तावेज का प्रकार' : '2. Document Preset'}
                </label>
                <select
                  value={selectedDocIndex}
                  onChange={(e) => setSelectedDocIndex(Number(e.target.value))}
                  className="w-full max-w-full min-w-0 box-border py-2 px-3 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {docPresets.map((d, idx) => (
                    <option key={d.id} value={idx}>
                      {language === 'hi' && d.label_hi ? d.label_hi : d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? '3. फोटो / हस्ताक्षर फाइल चुनें' : '3. Select Image File'}
                </label>
                <input
                  ref={resizerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setResizerImageFile(e.target.files[0]);
                      setResizerResult(null);
                    }
                  }}
                  className="w-full max-w-full overflow-hidden text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 dark:file:bg-amber-950 dark:file:text-amber-300 hover:file:bg-amber-200 cursor-pointer"
                />
              </div>

              {/* Name & DOP Stamp (Only for Photos) */}
              {currentDocPreset.photo && (
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 w-full max-w-full min-w-0 box-border">
                  <div className="min-w-0">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 truncate">
                      {language === 'hi' ? 'फोटो पर नाम (ऐच्छिक)' : 'Name on Photo (Opt.)'}
                    </label>
                    <input
                      type="text"
                      value={stampName}
                      onChange={(e) => setStampName(e.target.value)}
                      placeholder="e.g. AMIT KUMAR"
                      className="w-full max-w-full min-w-0 box-border py-1.5 px-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white uppercase"
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 truncate">
                      {language === 'hi' ? 'फोटो खींचने की तारीख (DOP)' : 'Date on Photo (Opt.)'}
                    </label>
                    <input
                      type="text"
                      value={stampDate}
                      onChange={(e) => setStampDate(e.target.value)}
                      placeholder="e.g. 15/11/2026"
                      className="w-full max-w-full min-w-0 box-border py-1.5 px-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleResizeAndCompress}
                disabled={isResizing || !resizerImageFile}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-rose-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Crop className="w-4 h-4" />
                <span>
                  {isResizing
                    ? language === 'hi'
                      ? 'प्रोसेसिंग...'
                      : 'Processing Image...'
                    : t.resizeButton}
                </span>
              </button>

              {/* Result Preview */}
              {resizerResult && (
                <div className="mt-3 p-3 rounded-xl border border-dashed border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 text-center">
                  <img
                    src={resizerResult.url}
                    alt="Resized preview"
                    className="max-h-36 mx-auto rounded border border-slate-300 dark:border-slate-700 bg-white shadow-xs object-contain"
                  />
                  <div className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {language === 'hi' ? 'तैयार:' : 'Ready:'} {resizerResult.w}x{resizerResult.h} px · {resizerResult.sizeKB} KB (JPG)
                  </div>
                  <a
                    href={resizerResult.url}
                    download={`ExamSetu_Toolkit_${selectedExam}_${resizerResult.sizeKB}KB.jpg`}
                    className="mt-2 inline-flex items-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'तैयार JPG डाउनलोड करें' : 'Download Ready JPG'}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= Tool 2: Age & Eligibility Calculator ================= */}
        <div className="w-full max-w-full min-w-0 box-border bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.tool2Title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.tool2Desc}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3.5">
              {/* Preset Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? 'परीक्षा प्रीसेट (या कस्टम)' : 'Exam Preset (or Custom)'}
                </label>
                <select
                  value={agePresetIndex}
                  onChange={(e) => handleAgePresetChange(Number(e.target.value))}
                  className="w-full max-w-full min-w-0 box-border py-2 px-3 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {AGE_PRESETS_DATA.map((p, idx) => (
                    <option key={idx} value={idx}>
                      {language === 'hi' && p.name_hi ? p.name_hi : p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DOB & Cutoff */}
              <div className="grid grid-cols-2 gap-2 w-full max-w-full min-w-0">
                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 truncate">
                    {language === 'hi' ? 'जन्म तिथि' : 'Date of Birth'}
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full max-w-full min-w-0 box-border py-2 px-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 truncate">
                    {language === 'hi' ? 'कटऑफ तिथि' : 'Cutoff Date'}
                  </label>
                  <input
                    type="date"
                    value={cutoffDate}
                    onChange={(e) => setCutoffDate(e.target.value)}
                    className="w-full max-w-full min-w-0 box-border py-2 px-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Min & Max Age */}
              <div className="grid grid-cols-2 gap-2 w-full max-w-full min-w-0">
                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 truncate">
                    {language === 'hi' ? 'न्यूनतम आयु (वर्ष)' : 'Min Age (Yrs)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={minAge}
                    onChange={(e) => setMinAge(parseFloat(e.target.value) || 0)}
                    className="w-full max-w-full min-w-0 box-border py-2 px-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 truncate">
                    {language === 'hi' ? 'अधिकतम आयु (सामान्य)' : 'Max Age (Gen)'}
                  </label>
                  <input
                    type="number"
                    value={maxAge}
                    onChange={(e) => setMaxAge(parseInt(e.target.value, 10) || 100)}
                    className="w-full max-w-full min-w-0 box-border py-2 px-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Category Relaxation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? 'आरक्षण श्रेणी अनुसार छूट' : 'Category Relaxation'}
                </label>
                <select
                  value={catRelaxation}
                  onChange={(e) => setCatRelaxation(Number(e.target.value))}
                  className="w-full max-w-full min-w-0 box-border py-2 px-3 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value={0}>
                    {language === 'hi' ? 'सामान्य / ईडब्ल्यूएस (+0 वर्ष)' : 'General / EWS (+0 Years)'}
                  </option>
                  <option value={3}>
                    {language === 'hi' ? 'ओबीसी (नॉन-क्रीमी लेयर) (+3 वर्ष)' : 'OBC Non-Creamy Layer (+3 Years)'}
                  </option>
                  <option value={5}>
                    {language === 'hi' ? 'एससी / एसटी (+5 वर्ष)' : 'SC / ST (+5 Years)'}
                  </option>
                  <option value={10}>
                    {language === 'hi' ? 'दिव्यांग (PwBD सामान्य) (+10 वर्ष)' : 'PwBD General (+10 Years)'}
                  </option>
                  <option value={13}>
                    {language === 'hi' ? 'दिव्यांग (PwBD ओबीसी) (+13 वर्ष)' : 'PwBD OBC (+13 Years)'}
                  </option>
                  <option value={15}>
                    {language === 'hi' ? 'दिव्यांग (PwBD एससी/एसटी) (+15 वर्ष)' : 'PwBD SC/ST (+15 Years)'}
                  </option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleCalculateAge}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-rose-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>{t.calcAgeButton}</span>
              </button>

              {/* Age Verdict Display */}
              {ageResult && (
                <div
                  className={`mt-3 p-3.5 rounded-xl border text-center ${
                    ageResult.eligible
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  }`}
                >
                  <div className="text-sm font-black">
                    {language === 'hi' ? 'कटऑफ तिथि पर आपकी आयु:' : 'Age on Cutoff:'}{' '}
                    <span className="font-mono tabular-nums">
                      {ageResult.years} {language === 'hi' ? 'वर्ष' : 'Yrs'}, {ageResult.months} {language === 'hi' ? 'माह' : 'Mos'}, {ageResult.days} {language === 'hi' ? 'दिन' : 'Days'}
                    </span>
                  </div>
                  <div
                    className={`mt-1 text-xs font-bold inline-flex items-center gap-1 ${
                      ageResult.eligible ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {ageResult.eligible ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>
                          {language === 'hi'
                            ? `पात्र हैं (${ageResult.minAge} से ${ageResult.effectiveMax} वर्ष सीमा)`
                            : `ELIGIBLE (${ageResult.minAge} to ${ageResult.effectiveMax} yrs limit)`}
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>
                          {language === 'hi'
                            ? `अपात्र (आवश्यक सीमा: ${ageResult.minAge} से ${ageResult.effectiveMax} वर्ष)`
                            : `NOT ELIGIBLE (Required: ${ageResult.minAge} to ${ageResult.effectiveMax} yrs)`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= Tool 3: Photo to Compressed PDF ================= */}
        <div className="w-full max-w-full min-w-0 box-border bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.tool3Title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.tool3Desc}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3.5">
              {/* PDF Target Size */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? '1. अधिकतम PDF साइज सीमा' : '1. Target Maximum PDF Size'}
                </label>
                <select
                  value={targetPdfKB}
                  onChange={(e) => setTargetPdfKB(Number(e.target.value))}
                  className="w-full max-w-full min-w-0 box-border py-2 px-3 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value={280}>
                    {language === 'hi'
                      ? '300 KB से कम (UPSC / SSC / BPSC मानक)'
                      : 'Under 300 KB (UPSC / SSC / BPSC standard)'}
                  </option>
                  <option value={190}>
                    {language === 'hi' ? '200 KB से कम' : 'Under 200 KB'}
                  </option>
                  <option value={480}>
                    {language === 'hi' ? '500 KB से कम' : 'Under 500 KB'}
                  </option>
                </select>
              </div>

              {/* File Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi'
                    ? '2. 1 से 5 दस्तावेज फोटो चुनें (JPG / PNG)'
                    : '2. Select 1 to 5 Images (JPG / PNG)'}
                </label>
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setPdfFiles(Array.from(e.target.files).slice(0, 5));
                      setPdfResult(null);
                    }
                  }}
                  className="w-full max-w-full overflow-hidden text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 dark:file:bg-amber-950 dark:file:text-amber-300 hover:file:bg-amber-200 cursor-pointer"
                />
                {pdfFiles.length > 0 && (
                  <div className="mt-1 text-[11px] text-slate-500 break-all">
                    {language === 'hi'
                      ? `चुनी गई फाइलें (${pdfFiles.length}): ${pdfFiles.map((f) => f.name).join(', ')}`
                      : `Selected ${pdfFiles.length} file(s): ${pdfFiles.map((f) => f.name).join(', ')}`}
                  </div>
                )}
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-400">
                {language === 'hi'
                  ? 'स्वचालित बहु-पृष्ठ अभिविन्यास, JPEG उप-नमूनाकरण और सरकारी पोर्टल विनिर्देशों के अनुसार मानक PDF-1.4 प्रारूप।'
                  : 'Automatic multi-page orientation, JPEG sub-sampling, and PDF-1.4 standards compliant with government portal file uploaders.'}
              </div>

              <button
                type="button"
                onClick={handleCreatePdf}
                disabled={isMakingPdf || !pdfFiles.length}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-rose-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>
                  {isMakingPdf
                    ? language === 'hi'
                      ? 'PDF तैयार की जा रही है...'
                      : 'Compiling PDF...'
                    : t.makePdfButton}
                </span>
              </button>

              {/* PDF Download Display */}
              {pdfResult && (
                <div className="mt-3 p-3.5 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 text-center">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    {language === 'hi' ? 'PDF सफलतापूर्वक बन गई!' : 'PDF Generated Successfully!'}
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {pdfResult.pages} {language === 'hi' ? 'पृष्ठ' : 'Page(s)'} · {pdfResult.sizeKB} KB total ({language === 'hi' ? `${targetPdfKB + 20} KB से कम` : `Under ${targetPdfKB + 20} KB`})
                  </div>
                  <a
                    href={pdfResult.url}
                    download={`ExamSetu_Toolkit_Document_${pdfResult.sizeKB}KB.pdf`}
                    className="mt-2.5 inline-flex items-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>
                      {language === 'hi'
                        ? `PDF डाउनलोड करें (${pdfResult.sizeKB} KB)`
                        : `Download PDF (${pdfResult.sizeKB} KB)`}
                    </span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
