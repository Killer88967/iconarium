import type { DeviconNormalized } from "../../core/types";
import type { DeviconSourceIcon } from "./source";

export function normalizeDevicons(data: DeviconSourceIcon[]) {
  const icons: Record<string, DeviconNormalized> = {};

  for (const icon of data) {
    const svgVariants = Array.from(new Set(icon.versions?.svg ?? []));

    const fontVariants = Array.from(new Set(icon.versions?.font ?? []));

    const variants = Array.from(new Set([...svgVariants, ...fontVariants]));

    icons[icon.name] = {
      name: icon.name,
      label: icon.name,
      provider: "devicons",
      aliases: icon.altnames ?? [],
      categories: [],
      tags: Array.from(
        new Set([icon.name, ...(icon.tags ?? []), ...(icon.altnames ?? [])]),
      ),
      deprecated: false,
      variants,
      svgVariants,
      fontVariants,
    };
  }

  return icons;
}
