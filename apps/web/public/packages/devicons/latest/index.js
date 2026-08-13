const metadata = {
  providerInfo: {
    id: "devicons",
    name: "Devicons",
    version: "seed",
    source: "https://github.com/devicons/devicon",
  },
  icons: {
    typescript: {
      name: "typescript",
      label: "TypeScript",
      provider: "devicons",
      aliases: [],
      categories: ["programming-language"],
      tags: ["typescript", "ts"],
      deprecated: false,
      variants: ["original", "plain", "original-wordmark", "plain-wordmark"],
    },
    rust: {
      name: "rust",
      label: "Rust",
      provider: "devicons",
      aliases: [],
      categories: ["programming-language"],
      tags: ["rust"],
      deprecated: false,
      variants: ["original", "plain", "line"],
    },
  },
};
export const icons = metadata.icons;
export const providerInfo = metadata.providerInfo;
export function getIcon(name, variant) {
  const icon = icons[name];
  if (!icon || !icon.variants.includes(variant)) return undefined;
  return { ...icon, variant, className: `devicon-${name}-${variant}` };
}
export function hasIcon(name) {
  return Object.prototype.hasOwnProperty.call(icons, name);
}
export function createClassName(name, variant) {
  return getIcon(name, variant)?.className;
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
