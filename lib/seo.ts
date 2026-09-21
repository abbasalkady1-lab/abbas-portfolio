const DEFAULT_SITE_URL = "https://www.abbasalkady.com";
const GOOGLE_SITE_VERIFICATION = "_85vh-6ShI-czj04aTqYVOIdTxeHUR4KxyF3njd4IGc";
const VERIFICATION_PATTERN = /^[A-Za-z0-9_-]{8,200}$/;

export function sanitizeVerificationToken(value?: string | null): string {
  const raw = (value || "").trim();
  if (!VERIFICATION_PATTERN.test(raw)) return "";
  return raw;
}

export function getSiteUrl(canonicalFromCms?: string | null): string {
  const raw = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    canonicalFromCms ||
    DEFAULT_SITE_URL
  ).trim();

  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    url.hash = "";
    url.search = "";
    const normalized = url.toString().replace(/\/$/, "");
    return normalized || DEFAULT_SITE_URL;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function resolveGoogleSiteVerification(fromCms?: string | null): string {
  return (
    sanitizeVerificationToken(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) ||
    sanitizeVerificationToken(fromCms) ||
    GOOGLE_SITE_VERIFICATION
  );
}

export function resolveBingSiteVerification(fromCms?: string | null): string {
  return (
    sanitizeVerificationToken(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) ||
    sanitizeVerificationToken(fromCms)
  );
}
