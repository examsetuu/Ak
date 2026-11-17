import { Language, QualificationLevel, ExamCategory } from '../types/exam';

export interface TranslationDict {
  appName: string;
  tagline: string;
  allExams: string;
  resizerTool: string;
  ageCalcTool: string;
  pdfTool: string;
  sheetSync: string;
  searchPlaceholder: string;
  chooseExam: string;
  chooseExamSub: string;
  filterByQualification: string;
  filterByCategory: string;
  filterByStatus: string;
  statusAll: string;
  statusOpen: string;
  statusAdmit: string;
  statusKey: string;
  statusResult: string;
  allQualifications: string;
  pass10th: string;
  pass12th: string;
  graduate: string;
  postGraduate: string;
  saved: string;
  examsFound: string;
  examFound: string;
  noExamFound: string;
  clearFilters: string;
  viewDates: string;
  applyGuide: string;
  verifiedBadge: string;
  govtPortalsOnly: string;
  studentToolsTitle: string;
  studentToolsHeading: string;
  studentToolsSub: string;
  lastDateBadge: string;
  admitCardBadge: string;
  answerKeyBadge: string;
  resultBadge: string;
  appOpenBadge: string;
  upcomingBadge: string;
  overview: string;
  importantDates: string;
  applicationFee: string;
  ageLimit: string;
  vacancies: string;
  eligibility: string;
  howToApply: string;
  selectionProcess: string;
  directLinks: string;
  officialNotificationPdf: string;
  officialPortal: string;
  thingsNeeded: string;
  officialSteps: string;
  openOfficialPage: string;
  close: string;
  disclaimer: string;
  disclaimerText: string;
  top: string;
  minQualification: string;
  officialPortalVerified: string;
  overviewHeading: string;
  datesHeading: string;
  feesHeading: string;
  ageHeading: string;
  vacanciesHeading: string;
  eligibilityHeading: string;
  selectionHeading: string;
  officialGuidesHeading: string;
  closeDetails: string;
  toolsHeading: string;
  toolsSubheading: string;
  tool1Title: string;
  tool1Desc: string;
  resizeButton: string;
  tool2Title: string;
  tool2Desc: string;
  calcAgeButton: string;
  tool3Title: string;
  tool3Desc: string;
  makePdfButton: string;
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  en: {
    appName: 'ExamSetu & Toolkit',
    tagline: 'Every exam update. One trusted place.',
    allExams: 'All Exams',
    resizerTool: 'Photo & Sign Resizer',
    ageCalcTool: 'Age & Eligibility',
    pdfTool: 'Photo to PDF (<300KB)',
    sheetSync: 'Google Sheet Sync',
    searchPlaceholder: 'Search any exam, board, or department (e.g. SSC, UPSC, IBPS, NEET, Railway, BPSC)...',
    chooseExam: 'Choose your exam',
    chooseExamSub: 'Tap an exam to see Admit Card, Result, Answer Key, Syllabus, and direct official Apply links.',
    filterByQualification: 'Filter by Qualification',
    filterByCategory: 'Filter by Category / Board',
    filterByStatus: 'Filter by Live Status',
    statusAll: 'All Statuses',
    statusOpen: 'Apply Open / Last Date',
    statusAdmit: 'Admit Card / Exam Soon',
    statusKey: 'Answer Key / Notice',
    statusResult: 'Result Declared',
    allQualifications: 'All Qualifications',
    pass10th: '10th Pass',
    pass12th: '12th Pass',
    graduate: 'Graduate',
    postGraduate: 'Post Graduate',
    saved: 'Saved',
    examsFound: 'examinations listed',
    examFound: 'examination listed',
    noExamFound: 'No exams found matching your criteria',
    clearFilters: 'Clear All Filters',
    viewDates: 'View Dates & Details',
    applyGuide: 'Apply Guide',
    verifiedBadge: 'Updated Nov 16, 2026',
    govtPortalsOnly: 'Government Portals Only',
    studentToolsTitle: 'Student Form Utility Station',
    studentToolsHeading: 'Essential Form Tools for Indian Exams',
    studentToolsSub: 'Resize Photo/Signature to exact board guidelines, calculate cutoff eligibility age, or merge marksheets into a certified PDF under 300 KB. 100% private in your browser.',
    lastDateBadge: 'Closing Soon',
    admitCardBadge: 'Admit Card / Exam Soon',
    answerKeyBadge: 'Answer Key Out',
    resultBadge: 'Result Declared',
    appOpenBadge: 'Application Open',
    upcomingBadge: 'Upcoming Cycle',
    overview: 'Overview & Purpose',
    importantDates: 'Important Dates',
    applicationFee: 'Application Fee Details',
    ageLimit: 'Age Limit & Relaxation Criteria',
    vacancies: 'Vacancy Distribution',
    eligibility: 'Educational Qualifications',
    howToApply: 'How to Apply',
    selectionProcess: 'Selection Architecture',
    directLinks: 'Direct Verified Links & Checklists',
    officialNotificationPdf: 'Official Notification PDF',
    officialPortal: 'Official Portal',
    thingsNeeded: 'Things Needed Before You Proceed:',
    officialSteps: 'Official Step-by-Step Procedure:',
    openOfficialPage: 'Open Official Page',
    close: 'Close',
    disclaimer: 'Disclaimer:',
    disclaimerText: 'ExamSetu & Toolkit is an independent public information portal and is not affiliated with, associated with, or authorized by any government department, agency, or examination board. Always verify dates and rules on official websites.',
    top: 'Top',
    minQualification: 'Min Qualification',
    officialPortalVerified: 'Verified Official Portal Information',
    overviewHeading: 'Overview & Purpose',
    datesHeading: 'Important Dates',
    feesHeading: 'Application Fee Details',
    ageHeading: 'Age Limit & Relaxation Criteria',
    vacanciesHeading: 'Vacancy Distribution',
    eligibilityHeading: 'Educational Qualifications',
    selectionHeading: 'Selection Architecture',
    officialGuidesHeading: 'Direct Verified Links & Checklists',
    closeDetails: 'Close Details',
    toolsHeading: 'Student Form Utility Station',
    toolsSubheading: 'Essential Form Tools for Indian Exams',
    tool1Title: 'Photo & Sign Resizer',
    tool1Desc: 'Exact SSC, IBPS, UPSC specs + Name/DOP Stamp',
    resizeButton: 'Resize & Compress',
    tool2Title: 'Age & Eligibility Calc',
    tool2Desc: 'Exact cutoff age with OBC / SC / ST / PwBD relaxation',
    calcAgeButton: 'Check Age & Eligibility',
    tool3Title: 'Photo to PDF (<300 KB)',
    tool3Desc: 'Merge 1–5 ID/marksheet photos into a small PDF file',
    makePdfButton: 'Create Compressed PDF',
  },
  hi: {
    appName: 'एग्जामसेतु एवं टूलकिट',
    tagline: 'हर परीक्षा का अपडेट। एक विश्वसनीय सेतु।',
    allExams: 'सभी परीक्षाएं',
    resizerTool: 'फोटो व हस्ताक्षर रीसाइज़र',
    ageCalcTool: 'आयु व पात्रता कैलकुलेटर',
    pdfTool: 'फोटो से PDF (<300KB)',
    sheetSync: 'गूगल शीट सिंक',
    searchPlaceholder: 'परीक्षा, बोर्ड या विभाग खोजें (जैसे SSC, रेलवे, UPSC, BPSC, बैंक, आर्मी)...',
    chooseExam: 'अपनी परीक्षा चुनें',
    chooseExamSub: 'एडमिट कार्ड, रिजल्ट, उत्तर कुंजी, सिलेबस और आधिकारिक आवेदन लिंक देखने के लिए परीक्षा पर टैप करें।',
    filterByQualification: 'योग्यता अनुसार खोजें (Qualification)',
    filterByCategory: 'बोर्ड व श्रेणी अनुसार (Category)',
    filterByStatus: 'ताजा स्थिति अनुसार (Live Status)',
    statusAll: 'सभी स्थिति',
    statusOpen: 'आवेदन शुरू / अंतिम तिथि',
    statusAdmit: 'एडमिट कार्ड / परीक्षा जल्द',
    statusKey: 'उत्तर कुंजी / समय-सारणी',
    statusResult: 'परिणाम (Result) घोषित',
    allQualifications: 'सभी योग्यताएं',
    pass10th: '10वीं पास (10th Pass)',
    pass12th: '12वीं पास (12th Pass)',
    graduate: 'स्नातक (Graduate)',
    postGraduate: 'परास्नातक (PG / B.Ed)',
    saved: 'सहेजे गए',
    examsFound: 'परीक्षाएं उपलब्ध',
    examFound: 'परीक्षा उपलब्ध',
    noExamFound: 'आपकी खोज के अनुसार कोई परीक्षा नहीं मिली',
    clearFilters: 'सभी फ़िल्टर हटाएं',
    viewDates: 'तिथियां व विवरण देखें',
    applyGuide: 'आवेदन गाइड',
    verifiedBadge: 'सत्यापित 16 नवंबर 2026',
    govtPortalsOnly: 'केवल सरकारी आधिकारिक पोर्टल',
    studentToolsTitle: 'विद्यार्थी फॉर्म टूल्स (Student Tools)',
    studentToolsHeading: 'सरकारी परीक्षाओं के लिए उपयोगी टूल्स',
    studentToolsSub: 'बोर्ड के नियमों अनुसार फोटो/हस्ताक्षर रीसाइज करें, कट-ऑफ आयु जांचें या प्रमाण पत्रों को 300 KB से कम की PDF में बदलें। आपका डेटा 100% सुरक्षित और आपके फोन/कंप्यूटर में ही रहता है।',
    lastDateBadge: 'अंतिम तिथि नजदीक',
    admitCardBadge: 'प्रवेश पत्र / परीक्षा जल्द',
    answerKeyBadge: 'उत्तर कुंजी जारी',
    resultBadge: 'परिणाम (Result) घोषित',
    appOpenBadge: 'आवेदन शुरू (Apply Open)',
    upcomingBadge: 'आगामी परीक्षा चक्र',
    overview: 'विवरण व संक्षिप्त सारांश',
    importantDates: 'महत्वपूर्ण तिथियां (Important Dates)',
    applicationFee: 'आवेदन शुल्क (Application Fee)',
    ageLimit: 'आयु सीमा व छूट (Age Limit & Relaxation)',
    vacancies: 'पदों का विवरण (Vacancies)',
    eligibility: 'शैक्षणिक योग्यता (Eligibility Criteria)',
    howToApply: 'आवेदन कैसे करें (How to Apply)',
    selectionProcess: 'चयन प्रक्रिया (Selection Process)',
    directLinks: 'सीधे आधिकारिक लिंक व चेकलिस्ट',
    officialNotificationPdf: 'आधिकारिक विज्ञप्ति PDF (Notification)',
    officialPortal: 'आधिकारिक वेबसाइट (Official Portal)',
    thingsNeeded: 'आवेदन से पहले जरूरी दस्तावेज (Things Needed):',
    officialSteps: 'आवेदन के चरणबद्ध निर्देश (Step-by-Step):',
    openOfficialPage: 'आधिकारिक पोर्टल खोलें',
    close: 'बंद करें',
    disclaimer: 'अस्वीकरण (Disclaimer):',
    disclaimerText: 'एग्जामसेतु एवं टूलकिट (ExamSetu & Toolkit) एक स्वतंत्र शैक्षिक सूचना पोर्टल है और यह किसी भी सरकारी विभाग, आयोग या एजेंसी से संबद्ध नहीं है। कृपया आवेदन करने से पूर्व सभी तिथियों व नियमों की पुष्टि आधिकारिक सरकारी विज्ञप्ति से अवश्य करें।',
    top: 'ऊपर जाएं',
    minQualification: 'न्यूनतम योग्यता',
    officialPortalVerified: 'सत्यापित आधिकारिक पोर्टल विवरण',
    overviewHeading: 'विवरण व उद्देश्य (Overview)',
    datesHeading: 'महत्वपूर्ण तिथियां (Important Dates)',
    feesHeading: 'आवेदन शुल्क विवरण (Application Fee)',
    ageHeading: 'आयु सीमा व छूट नियम (Age Limit)',
    vacanciesHeading: 'रिक्तियों का विवरण (Vacancies)',
    eligibilityHeading: 'शैक्षणिक योग्यता (Educational Qualifications)',
    selectionHeading: 'चयन प्रक्रिया व संरचना (Selection Process)',
    officialGuidesHeading: 'सीधे आधिकारिक लिंक व चेकलिस्ट',
    closeDetails: 'विवरण बंद करें',
    toolsHeading: 'विद्यार्थी फॉर्म टूल्स (Student Tools)',
    toolsSubheading: 'सरकारी परीक्षाओं हेतु उपयोगी फॉर्म टूल्स',
    tool1Title: 'फोटो व हस्ताक्षर रीसाइज़र',
    tool1Desc: 'SSC, IBPS, UPSC मानक + नाम व तारीख (DOP) स्टाम्प',
    resizeButton: 'रीसाइज और कंप्रेस करें',
    tool2Title: 'आयु व पात्रता कैलकुलेटर',
    tool2Desc: 'OBC, SC, ST, दिव्यांग छूट के साथ सटीक कट-ऑफ आयु',
    calcAgeButton: 'आयु व पात्रता की जांच करें',
    tool3Title: 'फोटो से PDF (<300 KB)',
    tool3Desc: 'मार्कशीट/पहचान पत्र को 300 KB से छोटे PDF में बदलें',
    makePdfButton: 'कंप्रेस्ड PDF बनाएं',
  },
};

export const QUALIFICATION_LABELS: Record<QualificationLevel, { en: string; hi: string }> = {
  All: { en: 'All Qualifications', hi: 'सभी योग्यताएं' },
  '10th': { en: '10th Pass', hi: '10वीं पास' },
  '12th': { en: '12th Pass', hi: '12वीं पास' },
  Graduate: { en: 'Graduate', hi: 'स्नातक (Graduate)' },
  PostGraduate: { en: 'Post Graduate', hi: 'परास्नातक (PG)' },
};

export const CATEGORY_LABELS: Record<ExamCategory, { en: string; hi: string }> = {
  All: { en: 'All', hi: 'सभी' },
  UPSC: { en: 'UPSC', hi: 'UPSC (यूपीएससी)' },
  SSC: { en: 'SSC', hi: 'SSC (एसएससी)' },
  Banking: { en: 'Banking', hi: 'बैंकिंग (Bank)' },
  Railway: { en: 'Railway', hi: 'रेलवे (RRB)' },
  Defence: { en: 'Defence', hi: 'रक्षा बल (Army/NDA)' },
  Entrance: { en: 'Entrance', hi: 'प्रवेश परीक्षा (NEET/JEE)' },
  State: { en: 'State PSC', hi: 'राज्य भर्ती (BPSC/UP)' },
  Board: { en: 'Board Exams', hi: 'बोर्ड परीक्षा (CBSE)' },
  Teaching: { en: 'Teaching', hi: 'शिक्षक भर्ती (CTET)' },
};
