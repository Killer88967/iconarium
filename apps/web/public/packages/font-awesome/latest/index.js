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
export const icons = metadata.icons;
export const providerInfo = metadata.providerInfo;
export function getIcon(style, name) {
  return icons[style]?.[name];
}
export function hasIcon(style, name) {
  return (
    !!icons[style] && Object.prototype.hasOwnProperty.call(icons[style], name)
  );
}
export function createClassName(style, name) {
  return getIcon(style, name)?.className;
}
export function searchIcons(style, query) {
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
