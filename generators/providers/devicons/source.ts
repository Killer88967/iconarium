import { fetchJson } from "../../core/http";
import type { SourceResult } from "../../core/types";

const BASE = "https://raw.githubusercontent.com/devicons/devicon/master";
export interface DeviconSourceIcon {
  name: string;
  altnames?: string[];
  tags?: string[];
  versions?: { svg?: string[]; font?: string[] };
  color?: string;
}
interface PackageJson {
  version: string;
}

export async function loadDeviconsSource(): Promise<
  SourceResult<DeviconSourceIcon[]>
> {
  const [data, pkg] = await Promise.all([
    fetchJson<DeviconSourceIcon[]>(`${BASE}/devicon.json`),
    fetchJson<PackageJson>(`${BASE}/package.json`),
  ]);
  return {
    version: pkg.version,
    source: "https://github.com/devicons/devicon",
    data,
  };
}
