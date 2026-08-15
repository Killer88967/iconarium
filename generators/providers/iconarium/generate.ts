import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { writePublicProvider } from "../../core/public-output";
import { writeText } from "../../core/files";
import { loadIconariumSource } from "./source";
import { normalizeIconariumIcon } from "./normalize";

export async function generateIconarium() {
  const source = await loadIconariumSource();

  const icons = Object.fromEntries(
    source.data
      .map((icon) => {
        const normalized = normalizeIconariumIcon(icon);

        return [normalized.name, normalized] as const;
      })
      .sort(([a], [b]) => a.localeCompare(b)),
  );

  const providerInfo = {
    id: "iconarium",
    name: "Iconarium",
    version: source.version,
    source: source.source,
  };

  const generated =
    `// Generated file. Do not edit.\n\n` +
    `export const icons = ${JSON.stringify(icons, null, 2)} as const;\n\n` +
    `export const providerInfo = ${JSON.stringify(
      providerInfo,
      null,
      2,
    )} as const;\n`;

  const out = "packages/iconarium/generated/icons.ts";

  await mkdir(dirname(out), {
    recursive: true,
  });

  await writeFile(out, generated, "utf8");

  const runtime =
    `const icons = ${JSON.stringify(icons)};\n` +
    `const providerInfo = ${JSON.stringify(providerInfo)};\n` +
    `export { icons, providerInfo };\n` +
    `export function getIcon(name) { return icons[name]; }\n` +
    `export function hasIcon(name) { return Object.prototype.hasOwnProperty.call(icons, name); }\n` +
    `export function searchIcons(query) { const q = String(query ?? "").trim().toLowerCase(); return Object.values(icons).filter((icon) => !q || [icon.name, icon.label, ...(icon.aliases || []), ...(icon.tags || [])].join(" ").toLowerCase().includes(q)); }\n`;

  const declarations =
    `export const icons: ${JSON.stringify(icons, null, 2)};\n` +
    `export const providerInfo: ${JSON.stringify(providerInfo, null, 2)};\n` +
    `export type IconariumIconMap = typeof icons;\n` +
    `export type IconariumIconName = keyof IconariumIconMap;\n` +
    `export function getIcon<N extends IconariumIconName>(name: N): IconariumIconMap[N];\n` +
    `export function hasIcon(name: string): name is IconariumIconName;\n` +
    `export function searchIcons(query: string): Array<IconariumIconMap[IconariumIconName]>;\n`;

  await writePublicProvider({
    provider: "iconarium",
    globalName: "iconarium",
    version: source.version,

    metadata: {
      providerInfo,
      icons,
    },

    esmRuntime: runtime,
    declarations,
  });

  for (const icon of source.data) {
    for (const version of ["latest", source.version]) {
      await writeText(
        join(
          "apps/web/public/packages/iconarium",
          version,
          "svg",
          icon.fileName,
        ),
        icon.svg,
      );
    }
  }

  console.log(
    `Generated Iconarium ${source.version}: ${Object.keys(icons).length} icons`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await generateIconarium();
}
