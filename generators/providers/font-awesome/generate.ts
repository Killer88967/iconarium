import { writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { mkdir } from "node:fs/promises";
import { writePublicProvider } from "../../core/public-output";
import { loadFontAwesomeSource } from "./source";
import { normalizeFontAwesome } from "./normalize";

export async function generateFontAwesome() {
  const source = await loadFontAwesomeSource();
  const icons = normalizeFontAwesome(source.data);
  const providerInfo = {
    id: "font-awesome",
    name: "Font Awesome Free",
    version: source.version,
    source: source.source,
  };

  const generated = `// Generated file. Do not edit.\nexport const icons = ${JSON.stringify(icons, null, 2)} as const;\n\nexport const providerInfo = ${JSON.stringify(providerInfo, null, 2)} as const;\n`;
  const out = "packages/font-awesome/generated/icons.ts";
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, generated, "utf8");

  const runtime = `const icons = ${JSON.stringify(icons)};\nconst providerInfo = ${JSON.stringify(providerInfo)};\nexport { icons, providerInfo };\nexport function getIcon(style, name) { return icons[style]?.[name]; }\nexport function hasIcon(style, name) { return !!icons[style] && Object.prototype.hasOwnProperty.call(icons[style], name); }\nexport function createClassName(style, name) { const icon = getIcon(style, name); return icon ? icon.className : undefined; }\nexport function searchIcons(style, query) { const q = String(query ?? "").trim().toLowerCase(); return Object.values(icons[style] ?? {}).filter((icon) => !q || [icon.name, icon.label, ...(icon.aliases || []), ...(icon.tags || [])].join(" ").toLowerCase().includes(q)); }\n`;
  const declarations = `export const icons: ${JSON.stringify(icons, null, 2)};\nexport const providerInfo: ${JSON.stringify(providerInfo, null, 2)};\nexport type FontAwesomeIconMap = typeof icons;\nexport type FontAwesomeStyle = keyof FontAwesomeIconMap;\nexport type FontAwesomeIconName<S extends FontAwesomeStyle> = keyof FontAwesomeIconMap[S] & string;\nexport function getIcon<S extends FontAwesomeStyle, N extends FontAwesomeIconName<S>>(style: S, name: N): FontAwesomeIconMap[S][N];\nexport function hasIcon<S extends FontAwesomeStyle>(style: S, name: string): name is FontAwesomeIconName<S>;\nexport function createClassName<S extends FontAwesomeStyle, N extends FontAwesomeIconName<S>>(style: S, name: N): string;\nexport function searchIcons<S extends FontAwesomeStyle>(style: S, query: string): Array<FontAwesomeIconMap[S][FontAwesomeIconName<S>]>;\n`;

  await writePublicProvider({
    provider: "font-awesome",
    globalName: "fontAwesome",
    version: source.version,
    metadata: { providerInfo, icons },
    esmRuntime: runtime,
    declarations,
  });
  console.log(
    `Generated Font Awesome ${source.version}: ${Object.values(icons).reduce((n, style) => n + Object.keys(style).length, 0)} style/icon entries`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`)
  await generateFontAwesome();
