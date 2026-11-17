import { BoardLoginInfo, ExamItem, ProcessType } from '../types/exam';

export type UrlSecurityStatus = 'secure' | 'insecure' | 'invalid';

export interface UrlSecurityResult {
  url: string;
  isSecure: boolean;
  status: UrlSecurityStatus;
  protocol: string | null;
  hostname: string | null;
  isOfficialDomain: boolean;
  badgeText: string;
  labelEn: string;
  labelHi: string;
}

const OFFICIAL_GOV_SUFFIXES = [
  '.gov.in',
  '.nic.in',
  '.ac.in',
  '.bank.in',
  '.org.in',
  '.res.in',
];

/**
 * Validates the security status of an official exam URL using an 'https' protocol check.
 */
export function validateExamUrlSecurity(rawUrl?: string | null): UrlSecurityResult {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) {
    return {
      url: '',
      isSecure: false,
      status: 'invalid',
      protocol: null,
      hostname: null,
      isOfficialDomain: false,
      badgeText: 'No URL',
      labelEn: 'Link unavailable or missing',
      labelHi: 'लिंक उपलब्ध नहीं है',
    };
  }

  try {
    const parsed = new URL(trimmed);
    const protocol = parsed.protocol.toLowerCase();
    const hostname = parsed.hostname.toLowerCase();
    const isHttps = protocol === 'https:';
    const isOfficialDomain = OFFICIAL_GOV_SUFFIXES.some(
      (suffix) => hostname.endsWith(suffix) || hostname === suffix.slice(1)
    );

    if (isHttps) {
      return {
        url: parsed.href,
        isSecure: true,
        status: 'secure',
        protocol,
        hostname,
        isOfficialDomain,
        badgeText: 'HTTPS',
        labelEn: 'Secure HTTPS connection (encrypted)',
        labelHi: 'सुरक्षित HTTPS कनेक्शन (एन्क्रिप्टेड)',
      };
    }

    return {
      url: parsed.href,
      isSecure: false,
      status: 'insecure',
      protocol,
      hostname,
      isOfficialDomain,
      badgeText: protocol === 'http:' ? 'HTTP · Insecure' : 'Insecure',
      labelEn: 'Insecure non-HTTPS link (unencrypted)',
      labelHi: 'असुरक्षित गैर-HTTPS लिंक (बिना एन्क्रिप्शन)',
    };
  } catch {
    return {
      url: trimmed,
      isSecure: false,
      status: 'invalid',
      protocol: null,
      hostname: null,
      isOfficialDomain: false,
      badgeText: 'Invalid URL',
      labelEn: 'Malformed or unverified URL format',
      labelHi: 'अमान्य या असत्यापित URL प्रारूप',
    };
  }
}

/**
 * Convenience boolean check returning true only when the URL strictly uses the 'https:' protocol.
 */
export function isHttpsUrl(rawUrl?: string | null): boolean {
  return validateExamUrlSecurity(rawUrl).isSecure;
}

/**
 * Resolves the effective target URL for a given process guide action on an exam.
 */
export function resolveExamProcessUrl(
  exam: ExamItem,
  processType: ProcessType,
  boardInfo?: BoardLoginInfo
): string {
  const mapKey: Record<ProcessType, string | undefined> = {
    'Apply Online': exam.p,
    'Admit Card': exam.a,
    Result: exam.r,
    'Answer Key': exam.k,
  };

  return (
    mapKey[processType] ||
    (boardInfo?.u2 && boardInfo.u2[processType]) ||
    boardInfo?.url ||
    exam.u
  );
}
