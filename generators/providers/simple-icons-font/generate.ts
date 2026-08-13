import { fetchJson } from "../../core/http";
import { writeAssetManifest } from "../../core/asset-manifest";
import { mirrorNpmAssets } from "../../core/npm-assets";

interface PackageJson {
  version: string;
}

const PACKAGE_NAME = "simple-icons-font";
const PROVIDER = "simple-icons-font";

export async function generateSimpleIconsFont() {
  const pkg = await fetchJson<PackageJson>(
    `https://cdn.jsdelivr.net/npm/${PACKAGE_NAME}@latest/package.json`,
  );

  const assets = await mirrorNpmAssets({
    provider: PROVIDER,
    packageName: PACKAGE_NAME,
    version: pkg.version,

    include(path) {
      return path.startsWith("/font/");
    },
  });

  await writeAssetManifest(PROVIDER, pkg.version, assets);

  console.log(
    `Mirrored Simple Icons Font ${pkg.version}: ${assets.length} files`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await generateSimpleIconsFont();
}
