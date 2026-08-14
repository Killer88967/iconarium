import { fetchJson } from "../../core/http";
import type { SourceResult } from "../../core/types";

interface PackageJson {
  version: string;
}

export interface OcticonSourceFile {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url: string | null;
}

const REPOSITORY = "https://github.com/primer/octicons";

const PACKAGE_JSON =
  "https://raw.githubusercontent.com/primer/octicons/main/lib/octicons_node/package.json";

export async function loadOcticonsSource(): Promise<
  SourceResult<OcticonSourceFile[]>
> {
  const pkg = await fetchJson<PackageJson>(PACKAGE_JSON);

  const files = await fetchJson<OcticonSourceFile[]>(
    `https://api.github.com/repos/primer/octicons/contents/icons?ref=v${pkg.version}`,
  );

  return {
    version: pkg.version,
    source: REPOSITORY,
    data: files,
  };
}
