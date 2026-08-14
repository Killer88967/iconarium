import type { OcticonNormalized } from "../../core/types";
import type { OcticonSourceFile } from "./source";

function createLabel(name: string) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function normalizeOcticons(files: OcticonSourceFile[]) {
  const icons: Record<string, OcticonNormalized> = {};

  for (const file of files) {
    if (file.type !== "file") {
      continue;
    }

    const match = file.name.match(/^(.+)-(\d+)\.svg$/);

    if (!match) {
      continue;
    }

    const [, name, sizeValue] = match;

    const size = Number(sizeValue);

    if (!Number.isFinite(size)) {
      continue;
    }

    const existing = icons[name];

    if (existing) {
      if (!existing.sizes.includes(size)) {
        existing.sizes.push(size);
        existing.sizes.sort((a, b) => a - b);
      }

      continue;
    }

    icons[name] = {
      name,
      label: createLabel(name),

      provider: "octicons",

      aliases: [],

      categories: [],

      tags: Array.from(new Set([name, ...name.split("-")])),

      deprecated: false,

      sizes: [size],
    };
  }

  return icons;
}
