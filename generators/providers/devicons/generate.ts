import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { writePublicProvider } from "../../core/public-output";
import { loadDeviconsSource } from "./source";
import { normalizeDevicons } from "./normalize";

export async function generateDevicons() {
  const source = await loadDeviconsSource();
  const icons = normalizeDevicons(source.data);
  const providerInfo = {
    id: "devicons",
    name: "Devicons",
    version: source.version,
    source: source.source,
  };
  const generated = `// Generated file. Do not edit.\nexport const icons = ${JSON.stringify(icons, null, 2)} as const;\n\nexport const providerInfo = ${JSON.stringify(providerInfo, null, 2)} as const;\n`;
  const out = "packages/devicons/generated/icons.ts";
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, generated, "utf8");

  const runtime = `const icons = ${JSON.stringify(icons)};\nconst providerInfo = ${JSON.stringify(providerInfo)};\nexport { icons, providerInfo };\nexport function getIcon(name, variant) { const icon = icons[name]; if (!icon || !icon.variants.includes(variant)) return undefined; return { ...icon, variant, className: \`devicon-\${name}-\${variant}\` }; }\nexport function hasIcon(name) { return Object.prototype.hasOwnProperty.call(icons, name); }\nexport function createClassName(name, variant) { const icon = getIcon(name, variant); return icon?.className; }\nexport function searchIcons(query) { const q = String(query ?? "").trim().toLowerCase(); return Object.values(icons).filter((icon) => !q || [icon.name, icon.label, ...(icon.aliases || []), ...(icon.tags || [])].join(" ").toLowerCase().includes(q)); }\n`;
  const declarations = `export const icons: ${JSON.stringify(icons, null, 2)};\nexport const providerInfo: ${JSON.stringify(providerInfo, null, 2)};\nexport type DeviconMap = typeof icons;\nexport type DeviconName = keyof DeviconMap;\nexport type DeviconVariant<N extends DeviconName> = DeviconMap[N]["variants"][number];\nexport function getIcon<N extends DeviconName, V extends DeviconVariant<N>>(name: N, variant: V): DeviconMap[N] & { variant: V; className: string };\nexport function hasIcon(name: string): name is DeviconName;\nexport function createClassName<N extends DeviconName, V extends DeviconVariant<N>>(name: N, variant: V): string;\nexport function searchIcons(query: string): Array<DeviconMap[DeviconName]>;\n`;
  await writePublicProvider({
    provider: "devicons",
    globalName: "devicons",
    version: source.version,
    metadata: { providerInfo, icons },
    esmRuntime: runtime,
    declarations,
  });
  console.log(
    `Generated Devicons ${source.version}: ${Object.keys(icons).length} icons`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) await generateDevicons();
