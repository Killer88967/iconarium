import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export async function writeText(path: string, value: string) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, value, "utf8");
}

export async function writeJson(path: string, value: unknown) {
  await writeText(path, JSON.stringify(value, null, 2) + "\n");
}

export async function resetDir(path: string) {
  await rm(path, { recursive: true, force: true });
  await mkdir(path, { recursive: true });
}

export function publicProviderDirs(provider: string, version: string) {
  return [
    join("apps", "web", "public", "packages", provider, "latest"),
    join("apps", "web", "public", "packages", provider, version),
  ];
}

export function tsLiteral(value: unknown): string {
  return JSON.stringify(value, null, 2);
}
