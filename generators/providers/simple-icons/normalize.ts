import type { SimpleIconNormalized } from "../../core/types";
import type { SimpleIconSourceIcon } from "./source";

function slugify(title: string) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");
}

export function normalizeSimpleIcons(data: SimpleIconSourceIcon[]) {
  const icons: Record<string, SimpleIconNormalized> = {};
  for (const icon of data) {
    const name = icon.slug ?? slugify(icon.title);
    const aliases = [
      ...(icon.aliases?.aka ?? []),
      ...(icon.aliases?.dup ?? []),
      ...Object.values(icon.aliases?.loc ?? {}),
    ];
    icons[name] = {
      name,
      label: icon.title,
      provider: "simple-icons",
      aliases,
      categories: ["brand"],
      tags: Array.from(new Set([name, icon.title, ...aliases])),
      deprecated: false,
      hex: icon.hex,
      source: icon.source,
      guidelines: icon.guidelines ?? null,
      license: icon.license ?? null,
    };
  }
  return icons;
}
