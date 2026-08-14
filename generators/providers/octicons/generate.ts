import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { writePublicProvider } from "../../core/public-output";
import { mirrorNpmAssets } from "../../core/npm-assets";
import { writeAssetManifest } from "../../core/asset-manifest";
import { loadOcticonsSource } from "./source";
import { normalizeOcticons } from "./normalize";

export async function generateOcticons() {
  const source = await loadOcticonsSource();
  const icons = normalizeOcticons(source.data);

  const providerInfo = {
    id: "octicons",
    name: "Octicons",
    version: source.version,
    source: source.source,
  };

  const generated =
    `// Generated file. Do not edit.\n` +
    `export const icons = ${JSON.stringify(icons, null, 2)} as const;\n\n` +
    `export const providerInfo = ${JSON.stringify(
      providerInfo,
      null,
      2,
    )} as const;\n`;

  const out = "packages/octicons/generated/icons.ts";

  await mkdir(dirname(out), {
    recursive: true,
  });

  await writeFile(out, generated, "utf8");

  const runtime =
    `const icons = ${JSON.stringify(icons)};\n` +
    `const providerInfo = ${JSON.stringify(providerInfo)};\n` +
    `export { icons, providerInfo };\n` +
    `export function getIcon(name, size) { const icon = icons[name]; if (!icon || !icon.sizes.includes(size)) return undefined; return { ...icon, size, fileName: \`\${name}-\${size}.svg\` }; }\n` +
    `export function hasIcon(name) { return Object.prototype.hasOwnProperty.call(icons, name); }\n` +
    `export function searchIcons(query) { const q = String(query ?? "").trim().toLowerCase(); return Object.values(icons).filter((icon) => !q || [icon.name, icon.label, ...(icon.aliases || []), ...(icon.tags || [])].join(" ").toLowerCase().includes(q)); }\n`;

  const declarations =
    `export const icons: ${JSON.stringify(icons, null, 2)};\n` +
    `export const providerInfo: ${JSON.stringify(providerInfo, null, 2)};\n` +
    `export type OcticonMap = typeof icons;\n` +
    `export type OcticonName = keyof OcticonMap;\n` +
    `export type OcticonSize<N extends OcticonName> = OcticonMap[N]["sizes"][number];\n` +
    `export function getIcon<N extends OcticonName, S extends OcticonSize<N>>(name: N, size: S): OcticonMap[N] & { size: S; fileName: string };\n` +
    `export function hasIcon(name: string): name is OcticonName;\n` +
    `export function searchIcons(query: string): Array<OcticonMap[OcticonName]>;\n`;

  await writePublicProvider({
    provider: "octicons",
    globalName: "octicons",
    version: source.version,

    metadata: {
      providerInfo,
      icons,
    },

    esmRuntime: runtime,
    declarations,
  });

  const assets = await mirrorNpmAssets({
    provider: "octicons",
    packageName: "@primer/octicons",
    version: source.version,

    include: (path) =>
      path === "/index.js" ||
      path === "/index.scss" ||
      path === "/build/build.css" ||
      path === "/build/data.json",
  });

  await writeAssetManifest("octicons", source.version, assets);

  console.log(
    `Generated Octicons ${source.version}: ${Object.keys(icons).length} icons`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await generateOcticons();
}
