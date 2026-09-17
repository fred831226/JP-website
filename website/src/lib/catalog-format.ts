export function floorCatalogNumber(value: string | null | undefined): string | null {
  if (value == null || value === "" || value === "null") return null;
  if (!/^\d+(?:\.\d+)?$/.test(value)) return value;
  const numericValue = Number(value);
  if (numericValue > 0 && numericValue < 1) return "小於 1";
  return String(Math.floor(numericValue));
}

export function formatCatalogRange(min: string | null, max: string | null): string {
  const formattedMin = floorCatalogNumber(min);
  const formattedMax = floorCatalogNumber(max);
  return formattedMin !== null && formattedMax !== null ? `${formattedMin}–${formattedMax}` : "未提供";
}
