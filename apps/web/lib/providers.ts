export const providers = {
  "font-awesome": {
    id: "font-awesome",
    name: "Font Awesome",
    description: "Popular icon toolkit with solid, regular, and brand styles.",
    website: "https://fontawesome.com",
    assetsProvider: "font-awesome",
    hasAssets: true,
    hasSvg: true,

    homepageDescription:
      "Browse brands, solid, and regular icons with style-aware autocomplete.",

    example: `import { getIcon } from "https://iconarium.vercel.app/packages/font-awesome/latest";

const facebook = getIcon("brands", "facebook");

console.log(facebook.className);`,
  },

  devicons: {
    id: "devicons",
    name: "Devicons",
    description: "Programming language, framework, and developer tool icons.",
    website: "https://devicon.dev",
    assetsProvider: "devicons",
    hasAssets: true,
    hasSvg: true,

    homepageDescription:
      "Access development-focused icons with icon-aware variant autocomplete.",

    example: `import { getIcon } from "https://iconarium.vercel.app/packages/devicons/latest";

const typescript = getIcon("typescript", "original");

console.log(typescript.className);`,
  },

  "simple-icons": {
    id: "simple-icons",
    name: "Simple Icons",
    description: "Brand icons for popular companies, products, and services.",
    website: "https://simpleicons.org",
    assetsProvider: "simple-icons-font",
    hasAssets: true,
    hasSvg: true,

    homepageDescription:
      "Use thousands of brand icons with strongly typed icon names and metadata.",

    example: `import { getIcon } from "https://iconarium.vercel.app/packages/simple-icons/latest";

const github = getIcon("github");

console.log(github.hex);`,
  },

  octicons: {
    id: "octicons",
    name: "Octicons",
    description: "GitHub's icon library used throughout GitHub and Primer.",
    website: "https://primer.style/octicons",
    assetsProvider: "octicons",
    hasAssets: true,
    hasSvg: true,

    homepageDescription:
      "Use GitHub's icon system with icon-aware size autocomplete.",

    example: `import { getIcon } from "https://iconarium.vercel.app/packages/octicons/latest";

const mark = getIcon("mark-github", 24);

console.log(mark.fileName);`,
  },
} as const;

export type ProviderId = keyof typeof providers;

export type Provider = (typeof providers)[ProviderId];

export const providerIds = Object.keys(providers) as ProviderId[];

export function isProviderId(value: string): value is ProviderId {
  return value in providers;
}

export function getProvider(id: string): Provider | undefined {
  if (!isProviderId(id)) {
    return undefined;
  }

  return providers[id];
}
