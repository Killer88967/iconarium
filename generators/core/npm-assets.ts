import { join } from "node:path";
import { fetchBytes, fetchJson } from "./http";
import { publicProviderDirs, writeBytes } from "./files";

interface JsDelivrFlatFile {
  name: string;
}

interface JsDelivrFlatResponse {
  files: JsDelivrFlatFile[];
}

interface MirrorOptions {
  provider: string;
  packageName: string;
  version: string;

  include(path: string): boolean;
}

export async function mirrorNpmAssets({
  provider,
  packageName,
  version,
  include,
}: MirrorOptions) {
  const metadataUrl = `https://data.jsdelivr.com/v1/package/npm/${packageName}@${version}/flat`;

  const metadata = await fetchJson<JsDelivrFlatResponse>(metadataUrl);

  const files = metadata.files.filter((file) => include(file.name));

  for (const file of files) {
    const relativePath = file.name.replace(/^\/+/, "");

    const url = `https://cdn.jsdelivr.net/npm/${packageName}@${version}/${relativePath}`;

    const bytes = await fetchBytes(url);

    for (const dir of publicProviderDirs(provider, version)) {
      await writeBytes(join(dir, relativePath), bytes);
    }
  }

  return files.map((file) => file.name);
}
