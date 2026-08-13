import { fetchJson } from "../../core/http";
import { mirrorNpmAssets } from "../../core/npm-assets";

interface PackageJson {
  version: string;
}

const PACKAGE_NAME = "simple-icons-font";

export async function generateSimpleIconsFont() {
  const pkg = await fetchJson<PackageJson>(
    `https://cdn.jsdelivr.net/npm/${PACKAGE_NAME}@latest/package.json`,
  );

  const assets = await mirrorNpmAssets({
    provider: "simple-icons-font",
    packageName: PACKAGE_NAME,
    version: pkg.version,

    include(path) {
      return path.startsWith("/font/");
    },
  });

  console.log(
    `Mirrored Simple Icons Font ${pkg.version}: ${assets.length} files`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await generateSimpleIconsFont();
}
