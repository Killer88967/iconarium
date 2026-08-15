import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { IconariumSourceIcon } from "./normalize";

const ICONS_DIRECTORY = "packages/iconarium/icons";

export async function loadIconariumSource() {
  const entries = await readdir(ICONS_DIRECTORY, {
    withFileTypes: true,
  });

  const icons: IconariumSourceIcon[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".svg")) {
      continue;
    }

    icons.push({
      fileName: entry.name,
      svg: await readFile(path.join(ICONS_DIRECTORY, entry.name), "utf8"),
    });
  }

  return {
    version: "0.1.0",
    source: "https://github.com/Killer88967/iconarium",
    data: icons,
  };
}
