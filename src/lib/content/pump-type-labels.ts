import type { PumpType } from "@/lib/validation/catalog";

/**
 * Build label → pumpTypeId from governed taxonomy.
 * Includes `name` and every `sourceLabels` entry; duplicate labels that
 * point at different ids throw (do not silently prefer one).
 */
export function buildPumpTypeLabelMap(pumpTypes: PumpType[]): Map<string, string> {
  const map = new Map<string, string>();

  for (const type of pumpTypes) {
    const labels = new Set([type.name, ...type.sourceLabels]);
    for (const label of labels) {
      const existing = map.get(label);
      if (existing && existing !== type.id) {
        throw new Error(
          `Pump type label conflict: "${label}" maps to both "${existing}" and "${type.id}"`,
        );
      }
      map.set(label, type.id);
    }
  }

  return map;
}

export function resolvePumpTypeId(
  label: string,
  labelMap: Map<string, string>,
): string | undefined {
  return labelMap.get(label);
}
