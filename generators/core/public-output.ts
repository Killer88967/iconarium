import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { publicProviderDirs, writeJson, writeText } from "./files";

interface PublicOptions {
  provider: string;
  globalName: string;
  version: string;
  metadata: unknown;
  esmRuntime: string;
  declarations: string;
  browserExports?: string[];
}

interface VersionManifest {
  latest: string;
  versions: string[];
}

const DEFAULT_BROWSER_EXPORTS = [
  "icons",
  "providerInfo",
  "getIcon",
  "hasIcon",
  "searchIcons",
] as const;

function createBrowserRuntime({
  globalName,
  esmRuntime,
  browserExports = [],
}: Pick<PublicOptions, "globalName" | "esmRuntime" | "browserExports">) {
  const exports = [...DEFAULT_BROWSER_EXPORTS, ...browserExports];

  const runtime = esmRuntime
    .replace(/^export /gm, "")
    .replace(/export\s*\{[^}]+\};?/g, "");

  return `// Generated file. Do not edit.\n\n(function (global) {
${runtime}

  global.IconMeta = global.IconMeta || {};
  global.IconMeta[${JSON.stringify(globalName)}] = {
    ${exports.join(",\n    ")}
  };
})(globalThis);
`;
}

async function writeVersionsManifest(provider: string, version: string) {
  const path = join(
    "apps",
    "web",
    "public",
    "packages",
    provider,
    "versions.json",
  );

  let versions: string[] = [];

  try {
    const current = JSON.parse(
      await readFile(path, "utf8"),
    ) as Partial<VersionManifest>;

    if (Array.isArray(current.versions)) {
      versions = current.versions;
    }
  } catch {
    // The manifest does not exist yet.
  }

  versions = Array.from(new Set([...versions, version]));

  await writeJson(path, {
    latest: version,
    versions,
  } satisfies VersionManifest);
}

export async function writePublicProvider(options: PublicOptions) {
  const metadataJson = JSON.stringify(options.metadata);
  const browserRuntime = createBrowserRuntime(options);

  const metadataModule = [
    `const metadata = ${metadataJson};`,
    "",
    "export default metadata;",
    "export { metadata };",
    "",
  ].join("\n");

  const version = {
    provider: options.provider,
    version: options.version,
  };

  for (const dir of publicProviderDirs(options.provider, options.version)) {
    await Promise.all([
      writeJson(join(dir, "metadata.json"), options.metadata),
      writeText(join(dir, "metadata.js"), metadataModule),
      writeText(join(dir, "index.js"), options.esmRuntime),
      writeText(join(dir, "index.d.ts"), options.declarations),
      writeJson(join(dir, "version.json"), version),
      writeText(join(dir, "browser.js"), browserRuntime),
    ]);
  }

  await writeVersionsManifest(options.provider, options.version);
}
