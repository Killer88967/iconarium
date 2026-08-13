import { fetchJson } from "../../core/http";
import type { SourceResult } from "../../core/types";

const BASE =
  "https://raw.githubusercontent.com/simple-icons/simple-icons/develop";
export interface SimpleIconSourceIcon {
  title: string;
  slug?: string;
  hex: string;
  source: string;
  guidelines?: string;
  aliases?: { aka?: string[]; dup?: string[]; loc?: Record<string, string> };
  license?: { type: string; url?: string };
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
