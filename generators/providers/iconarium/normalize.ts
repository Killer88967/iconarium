import path from "node:path";
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

function readViewBox(svg: string): string {
  const match = svg.match(/\bviewBox=(["'])(.*?)\1/i);

  if (!match) {
    throw new Error("SVG is missing a viewBox.");
  }

  return match[2];
}

export function normalizeIconariumIcon(
  source: IconariumSourceIcon,
): IconariumNormalized {
  const name = path.basename(source.fileName, ".svg");

  return {
    name,
    label: createLabel(name),

    provider: "iconarium",

    aliases: [],
    categories: [],

    tags: Array.from(new Set([name, ...name.split("-")])),

    deprecated: false,

    fileName: source.fileName,
    viewBox: readViewBox(source.svg),
  };
}
