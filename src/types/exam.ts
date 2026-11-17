export type ExamCategory =
  | 'All'
  | 'UPSC'
  | 'SSC'
  | 'Banking'
  | 'Railway'
  | 'Defence'
  | 'Entrance'
  | 'State'
  | 'Board'
  | 'Teaching';

export type QualificationLevel = 'All' | '10th' | '12th' | 'Graduate' | 'PostGraduate';

export type Language = 'en' | 'hi';

export type ExamStatusType = 'red' | 'orange' | 'green' | 'blue';

export interface ExamDetailData {
  sample?: number;
  demo?: number;
  sum?: string;
  sum_hi?: string;
  dates?: [string, string][];
  dates_hi?: [string, string][];
  fee?: [string, string][];
  fee_hi?: [string, string][];
  age?: string;
  age_hi?: string;
  vac?: string;
  vac_hi?: string;
  el?: string;
  el_hi?: string;
  sel?: string;
  sel_hi?: string;
}

export interface ExamItem {
  id?: string;
  n: string; // English Name
  n_hi?: string; // Hindi Name
  q: QualificationLevel; // Minimum Qualification: '10th' | '12th' | 'Graduate' | 'PostGraduate'
  st?: string; // Status badge text
  st_hi?: string; // Hindi status badge text
  sc?: ExamStatusType; // Status color
  o: string; // Organization (Conducting Body)
  o_hi?: string; // Hindi Organization Name
  c: ExamCategory; // Category
  u: string; // Official portal URL
  p?: string; // Apply Online URL
  a?: string; // Admit card URL
  r?: string; // Result URL
  k?: string; // Answer Key URL
  s?: string; // Syllabus URL
  f?: string; // Official Notification PDF URL
  d?: ExamDetailData; // Detailed data
}

export type ProcessType = 'Apply Online' | 'Admit Card' | 'Result' | 'Answer Key';

export type LegalPage = 'about' | 'contact' | 'privacy' | 'disclaimer';

export interface BoardLoginInfo {
  name: string;
  name_hi?: string;
  url: string;
  k: ProcessType[];
  common: string[];
  steps: Partial<Record<ProcessType, string[]>>;
  steps_hi?: Partial<Record<ProcessType, string[]>>;
  u2?: Partial<Record<ProcessType, string>>;
  req?: Partial<Record<ProcessType, string[]>>;
  req_hi?: Partial<Record<ProcessType, string[]>>;
}

export interface DocPreset {
  id: string;
  label: string;
  label_hi?: string;
  w: number;
  h: number;
  maxKB: number;
  photo: boolean;
}

export interface AgePreset {
  name: string;
  name_hi?: string;
  min: number;
  max: number;
  cut: string;
}
