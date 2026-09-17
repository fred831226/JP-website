export interface CatalogFilterState {
  brand: string | null;
  type: string | null;
  q: string;
}

interface CatalogQueryOptions {
  brandIds: string[];
  typeIds: string[];
}

interface SearchParamsReader {
  getAll(name: string): string[];
}

export function normalizeCatalogQuery(
  searchParams: SearchParamsReader,
  options: CatalogQueryOptions,
): CatalogFilterState {
  const brandAllowed = new Set(options.brandIds);
  const rawBrands = searchParams.getAll("brand").filter(Boolean);
  const brand = rawBrands.length === 1 && brandAllowed.has(rawBrands[0])
    ? rawBrands[0]
    : null;

  const rawTypes = [...new Set(searchParams.getAll("type").filter(Boolean))];
  const typeAllowed = new Set(options.typeIds);
  const validTypes = rawTypes.filter((value) => typeAllowed.has(value));
  const type = validTypes.length === 1 ? validTypes[0] : null;
  const q = searchParams.getAll("q").map((value) => value.trim()).find(Boolean) ?? "";

  return { brand, type, q };
}

export function catalogHref(state: CatalogFilterState): string {
  const params = new URLSearchParams();
  if (state.brand) params.set("brand", state.brand);
  if (state.type) params.set("type", state.type);
  if (state.q) params.set("q", state.q);
  const query = params.toString();
  return `/zh-tw/products${query ? `?${query}` : ""}`;
}
