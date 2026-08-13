(function (global) {
  const metadata = {
    providerInfo: {
      id: "font-awesome",
      name: "Font Awesome Free",
      version: "seed",
      source: "https://github.com/FortAwesome/Font-Awesome",
    },
    icons: {
      brands: {
        facebook: {
          name: "facebook",
          label: "Facebook",
          provider: "font-awesome",
          style: "brands",
          prefix: "fa-brands",
          className: "fa-brands fa-facebook",
          unicode: "f09a",
          aliases: [],
          categories: ["social"],
          tags: ["facebook", "social"],
          deprecated: false,
        },
      },
      solid: {
        house: {
          name: "house",
          label: "House",
          provider: "font-awesome",
          style: "solid",
          prefix: "fa-solid",
          className: "fa-solid fa-house",
          unicode: "f015",
          aliases: ["home"],
          categories: [],
          tags: ["house", "home"],
          deprecated: false,
        },
      },
    },
  };
  const icons = metadata.icons;
  function getIcon(style, name) {
    return icons[style]?.[name];
  }
  function hasIcon(style, name) {
    return (
      !!icons[style] && Object.prototype.hasOwnProperty.call(icons[style], name)
    );
  }
  function createClassName(style, name) {
    return getIcon(style, name)?.className;
  }
  function searchIcons(style, query) {
    const q = String(query ?? "")
      .trim()
      .toLowerCase();
    return Object.values(icons[style] ?? {}).filter(
      (i) =>
        !q ||
        [i.name, i.label, ...(i.aliases || []), ...(i.tags || [])]
          .join(" ")
          .toLowerCase()
          .includes(q),
    );
  }
  global.IconMeta = global.IconMeta || {};
  global.IconMeta.fontAwesome = {
    icons,
    providerInfo: metadata.providerInfo,
    getIcon,
    hasIcon,
    createClassName,
    searchIcons,
  };
})(globalThis);
