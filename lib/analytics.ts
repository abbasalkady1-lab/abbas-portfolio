const GA_ID_PATTERN = /^(G|GT|UA)-[A-Z0-9-]+$/i;

export function sanitizeGaMeasurementId(value?: string | null): string {
  const raw = (value || "").trim();
  if (!GA_ID_PATTERN.test(raw)) return "";
  return raw;
}

export function resolveGaMeasurementId(fromSeo?: string | null): string {
  return (
    sanitizeGaMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) ||
    sanitizeGaMeasurementId(process.env.NEXT_PUBLIC_GA_ID) ||
    sanitizeGaMeasurementId(fromSeo)
  );
}
