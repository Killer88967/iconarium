const metadata = {
  providerInfo: {
    id: "simple-icons",
    name: "Simple Icons",
    version: "seed",
    source: "https://github.com/simple-icons/simple-icons",
  },
  icons: {
    github: {
      name: "github",
      label: "GitHub",
      provider: "simple-icons",
      aliases: [],
      categories: ["brand"],
      tags: ["github"],
      deprecated: false,
      hex: "181717",
      source: "https://github.com/",
      guidelines: null,
      license: null,
    },
    typescript: {
      name: "typescript",
      label: "TypeScript",
      provider: "simple-icons",
      aliases: [],
      categories: ["brand"],
      tags: ["typescript"],
      deprecated: false,
      hex: "3178C6",
      source: "https://www.typescriptlang.org/",
      guidelines: null,
      license: null,
    },
  },
};
export const icons = metadata.icons;
export const providerInfo = metadata.providerInfo;
export function getIcon(name) {
  return icons[name];
}
export function hasIcon(name) {
  return Object.prototype.hasOwnProperty.call(icons, name);
}
export function searchIcons(query) {
  const q = String(query ?? "")
    .trim()
    .toLowerCase();
  return Object.values(icons).filter(
    (i) =>
      !q ||
      [i.name, i.label, ...(i.aliases || []), ...(i.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(q),
  );
}
