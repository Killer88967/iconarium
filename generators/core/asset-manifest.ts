import { join } from "node:path";
import { publicProviderDirs, writeText } from "./files";

export interface AssetManifest {
  provider: string;
  version: string;

  assets: {
    css: string[];
    fonts: string[];
    other: string[];
  };
}

function classifyAssets(files: string[]): AssetManifest["assets"] {
  const css: string[] = [];
  const fonts: string[] = [];
  const other: string[] = [];

  for (const file of files) {
    if (file.endsWith(".css")) {
      css.push(file);
      continue;
    }

    if (
      file.endsWith(".woff") ||
      file.endsWith(".woff2") ||
      file.endsWith(".ttf") ||
      file.endsWith(".otf") ||
      file.endsWith(".eot")
    ) {
      fonts.push(file);
      continue;
    }

    other.push(file);
  }

  return {
    css: css.sort(),
    fonts: fonts.sort(),
    other: other.sort(),
  };
}

export async function writeAssetManifest(
  provider: string,
  version: string,
  files: string[],
) {
  const manifest: AssetManifest = {
    provider,
    version,
    assets: classifyAssets(files),
  };

  const json = JSON.stringify(manifest, null, 2) + "\n";

  for (const dir of publicProviderDirs(provider, version)) {
    await writeText(join(dir, "assets.json"), json);
  }

  return manifest;
}
