import type { IconariumNormalized } from "../../core/types";

export interface IconariumSourceIcon {
  fileName: string;
  svg: string;
}

function createLabel(name: string) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function normalizeIconarium(files: IconariumSourceIcon[]) {
  const icons: Record<string, IconariumNormalized> = {};

  for (const file of files) {
    const match = file.fileName.match(/^(.+)-(\d+)\.svg$/);

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

      provider: "iconarium",

      aliases: [],

      categories: [],

      tags: Array.from(new Set([name, ...name.split("-")])),

      deprecated: false,

      sizes: [size],
    };
  }

  return icons;
}
