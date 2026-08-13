import { fetchJson } from "../../core/http";
import type { SourceResult } from "../../core/types";

const BASE = "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/7.x";

export interface FontAwesomeSourceIcon {
  label: string;
  unicode?: string;
  styles?: string[];
  free?: string[];
  search?: { terms?: string[] };
  aliases?: { names?: string[] };
  changes?: string[];
}

interface PackageJson {
  version: string;
}

export async function loadFontAwesomeSource(): Promise<
  SourceResult<Record<string, FontAwesomeSourceIcon>>
> {
  const [data, pkg] = await Promise.all([
    fetchJson<Record<string, FontAwesomeSourceIcon>>(
      `${BASE}/metadata/icons.json`,
    ),
    fetchJson<PackageJson>(`${BASE}/package.json`),
  ]);
  return {
    version: pkg.version,
    source: "https://github.com/FortAwesome/Font-Awesome",
    data,
  };
}
