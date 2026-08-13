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
export default metadata;
export { metadata };
