(function (global) {
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
  const icons = metadata.icons;
  function getIcon(name, variant) {
    const icon = icons[name];
    if (!icon || !icon.variants.includes(variant)) return undefined;
    return { ...icon, variant, className: `devicon-${name}-${variant}` };
  }
  function hasIcon(name) {
    return Object.prototype.hasOwnProperty.call(icons, name);
  }
  function createClassName(name, variant) {
    return getIcon(name, variant)?.className;
  }
  function searchIcons(query) {
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
  global.IconMeta = global.IconMeta || {};
  global.IconMeta.devicons = {
    icons,
    providerInfo: metadata.providerInfo,
    getIcon,
    hasIcon,
    createClassName,
    searchIcons,
  };
})(globalThis);
