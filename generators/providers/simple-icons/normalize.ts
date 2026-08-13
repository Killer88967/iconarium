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

function normalizeAliases(values: unknown): string[] {
  if (typeof values === "string") {
    return [values];
  }

  if (Array.isArray(values)) {
    return values.flatMap(normalizeAliases);
  }

  if (typeof values === "object" && values !== null) {
    if ("title" in values && typeof values.title === "string") {
      return [values.title];
    }

    return Object.values(values).flatMap(normalizeAliases);
  }

  return [];
}

export function normalizeSimpleIcons(data: SimpleIconSourceIcon[]) {
  const icons: Record<string, SimpleIconNormalized> = {};

  for (const icon of data) {
    const name = icon.slug ?? slugify(icon.title);

    const aliases = [
      ...normalizeAliases(icon.aliases?.aka),
      ...normalizeAliases(icon.aliases?.dup),
      ...normalizeAliases(Object.values(icon.aliases?.loc ?? {})),
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
