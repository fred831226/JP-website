export interface CatalogFilterState {
  brand: string | null;
  types: string[];
  purposes: string[];
  q: string;
}

interface CatalogQueryOptions {
  brandIds: string[];
  typeIds: string[];
  purposeIds: string[];
}

interface SearchParamsReader {
  getAll(name: string): string[];
}

function allowedUnique(values: string[], allowed: Set<string>): string[] {
  const result: string[] = [];
  for (const value of values) {
    if (!allowed.has(value) || result.includes(value)) continue;
    result.push(value);
  }
  return result;
}

export function normalizeCatalogQuery(
  searchParams: SearchParamsReader,
  options: CatalogQueryOptions,
): CatalogFilterState {
  const brandAllowed = new Set(options.brandIds);
  const rawBrands = searchParams.getAll("brand").filter(Boolean);
  const brands = allowedUnique(rawBrands, brandAllowed);
  const brand = rawBrands.every((value) => brandAllowed.has(value)) && brands.length === 1
    ? brands[0]
    : null;

  const types = allowedUnique(searchParams.getAll("type").filter(Boolean), new Set(options.typeIds));
  const purposes = allowedUnique(searchParams.getAll("purpose").filter(Boolean), new Set(options.purposeIds));
  const q = searchParams.getAll("q").map((value) => value.trim()).find(Boolean) ?? "";

  return { brand, types, purposes, q };
}

export function catalogHref(state: CatalogFilterState): string {
  const params = new URLSearchParams();
  if (state.brand) params.set("brand", state.brand);
  for (const type of state.types) params.append("type", type);
  for (const purpose of state.purposes) params.append("purpose", purpose);
  if (state.q) params.set("q", state.q);
  const query = params.toString();
  return `/zh-tw/products${query ? `?${query}` : ""}`;
}
