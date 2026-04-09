// Tạo query string từ params, bỏ qua null/undefined/empty values
export function buildQuery(
  params: Record<string, string | number | null | undefined>,
): string {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") p.set(k, String(v));
  });
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}
