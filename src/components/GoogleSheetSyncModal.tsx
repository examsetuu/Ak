import React, { useState } from 'react';
import { X, TableProperties, RefreshCw, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { ExamItem } from '../types/exam';

interface GoogleSheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncExams: (exams: ExamItem[]) => void;
}

export const GoogleSheetSyncModal: React.FC<GoogleSheetSyncModalProps> = ({
  isOpen,
  onClose,
  onSyncExams,
}) => {
  const [sheetUrl, setSheetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSync = async () => {
    if (!sheetUrl.trim()) {
      setStatus({ type: 'error', message: 'Please enter a valid Google Sheet CSV URL.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(sheetUrl);
      if (!res.ok) {
        throw new Error(`Failed to fetch sheet: HTTP ${res.status}`);
      }
      const csv = await res.text();
      const rows = csv
        .trim()
        .split(/\r?\n/)
        .map((row) =>
          row
            .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
            .map((cell) => cell.replace(/^"|"$/g, '').trim())
        );

      if (rows.length < 2) {
        throw new Error('CSV sheet appears empty or has only header row.');
      }

      const headers = rows.shift() || [];
      const liveExams: ExamItem[] = rows
        .map((row) => {
          const obj: any = {};
          headers.forEach((h, idx) => {
            if (row[idx]) obj[h] = row[idx];
          });
          return obj as ExamItem;
        })
        .filter((item) => item.n && item.u);

      if (liveExams.length === 0) {
        throw new Error('No valid exams found. Ensure columns contain "n" (Exam Name) and "u" (Portal URL).');
      }

      onSyncExams(liveExams);
      setStatus({
        type: 'success',
        message: `Successfully synchronized ${liveExams.length} exams from Google Sheet!`,
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Error parsing Google Sheet CSV. Ensure the sheet is Published to Web as CSV.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl text-slate-900 dark:text-slate-100">
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <TableProperties className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Sync Live Exams via Google Sheets
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connect your spreadsheet to update notification links in real-time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Published Google Sheet CSV Link
            </label>
            <input
              type="url"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
              How to Publish your Google Sheet as CSV:
            </div>
            <ol className="list-decimal list-inside space-y-1">
              <li>In your Google Sheet, click <b>File &rarr; Share &rarr; Publish to web</b>.</li>
              <li>Choose <b>Entire Document</b> or Sheet name, and format <b>Comma-separated values (.csv)</b>.</li>
              <li>Click <b>Publish</b> and paste the generated URL here.</li>
            </ol>
            <div className="mt-2 text-[11px] text-slate-500">
              Expected header columns: <code className="font-mono text-amber-700 dark:text-amber-400">n, o, c, u, p, a, r, k, s, f, st, sc</code>
            </div>
          </div>

          {status && (
            <div
              className={`p-3 rounded-lg text-xs font-medium flex items-start gap-2 ${
                status.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{status.message}</span>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSync}
            disabled={loading}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Syncing...' : 'Sync Exams Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
