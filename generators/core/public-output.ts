import { join } from "node:path";
import { publicProviderDirs, writeJson, writeText } from "./files";

interface PublicOptions {
  provider: string;
  globalName: string;
  version: string;
  metadata: unknown;
  esmRuntime: string;
  declarations: string;
}

export async function writePublicProvider(options: PublicOptions) {
  for (const dir of publicProviderDirs(options.provider, options.version)) {
    await writeJson(join(dir, "metadata.json"), options.metadata);
    await writeText(
      join(dir, "metadata.js"),
      `export default ${JSON.stringify(options.metadata)};\nexport const metadata = ${JSON.stringify(options.metadata)};\n`,
    );
    await writeText(join(dir, "index.js"), options.esmRuntime);
    await writeText(join(dir, "index.d.ts"), options.declarations);
    await writeJson(join(dir, "version.json"), {
      provider: options.provider,
      version: options.version,
    });

    const browser = `(function (global) {\n${options.esmRuntime
      .replace(/^export /gm, "")
      .replace(
        /export\s*\{[^}]+\};?/g,
        "",
      )}\n  global.IconMeta = global.IconMeta || {};\n  global.IconMeta[${JSON.stringify(options.globalName)}] = { icons, providerInfo, getIcon, hasIcon, searchIcons${options.provider !== "simple-icons" ? ", createClassName" : ""} };\n})(globalThis);\n`;
    await writeText(join(dir, "browser.js"), browser);
  }
}
