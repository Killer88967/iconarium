import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { writePublicProvider } from "../../core/public-output";
import { loadSimpleIconsSource } from "./source";
import { normalizeSimpleIcons } from "./normalize";

export async function generateSimpleIcons() {
  const source = await loadSimpleIconsSource();
  const icons = normalizeSimpleIcons(source.data);
  const providerInfo = {
    id: "simple-icons",
    name: "Simple Icons",
    version: source.version,
    source: source.source,
  };
  const generated = `// Generated file. Do not edit.\nexport const icons = ${JSON.stringify(icons, null, 2)} as const;\n\nexport const providerInfo = ${JSON.stringify(providerInfo, null, 2)} as const;\n`;
  const out = "packages/simple-icons/generated/icons.ts";
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, generated, "utf8");

  const runtime = `const icons = ${JSON.stringify(icons)};\nconst providerInfo = ${JSON.stringify(providerInfo)};\nexport { icons, providerInfo };\nexport function getIcon(name) { return icons[name]; }\nexport function hasIcon(name) { return Object.prototype.hasOwnProperty.call(icons, name); }\nexport function searchIcons(query) { const q = String(query ?? "").trim().toLowerCase(); return Object.values(icons).filter((icon) => !q || [icon.name, icon.label, ...(icon.aliases || []), ...(icon.tags || [])].join(" ").toLowerCase().includes(q)); }\n`;
  const declarations = `export const icons: ${JSON.stringify(icons, null, 2)};\nexport const providerInfo: ${JSON.stringify(providerInfo, null, 2)};\nexport type SimpleIconMap = typeof icons;\nexport type SimpleIconName = keyof SimpleIconMap;\nexport function getIcon<N extends SimpleIconName>(name: N): SimpleIconMap[N];\nexport function hasIcon(name: string): name is SimpleIconName;\nexport function searchIcons(query: string): Array<SimpleIconMap[SimpleIconName]>;\n`;
  await writePublicProvider({
    provider: "simple-icons",
    globalName: "simpleIcons",
    version: source.version,
    metadata: { providerInfo, icons },
    esmRuntime: runtime,
    declarations,
  });
  console.log(
    `Generated Simple Icons ${source.version}: ${Object.keys(icons).length} icons`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`)
  await generateSimpleIcons();
