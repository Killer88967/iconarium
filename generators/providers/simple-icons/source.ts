import { fetchJson } from "../../core/http";
import type { SourceResult } from "../../core/types";

const BASE = "https://cdn.jsdelivr.net/npm/simple-icons@latest";

export interface SimpleIconDuplicateAlias {
  title: string;
  hex?: string;
  guidelines?: string;
}

export interface SimpleIconAliases {
  aka?: string[];
  dup?: SimpleIconDuplicateAlias[];
  loc?: Record<string, string>;
  old?: string[];
}

export interface SimpleIconSourceIcon {
  title: string;
  slug?: string;
  hex: string;
  source: string;
  guidelines?: string;
  aliases?: SimpleIconAliases;
  license?: {
    type: string;
    url?: string;
  };
}

interface PackageJson {
  version: string;
}

export async function loadSimpleIconsSource(): Promise<
  SourceResult<SimpleIconSourceIcon[]>
> {
  const [data, pkg] = await Promise.all([
    fetchJson<SimpleIconSourceIcon[]>(`${BASE}/data/simple-icons.json`),
    fetchJson<PackageJson>(`${BASE}/package.json`),
  ]);
  return {
    version: pkg.version,
    source: "https://github.com/simple-icons/simple-icons",
    data,
  };
}
