export const providers = {
  "font-awesome": {
    id: "font-awesome",
    name: "Font Awesome",
    description: "Popular icon toolkit with solid, regular, and brand styles.",
    website: "https://fontawesome.com",
    assetsProvider: "font-awesome",
    hasAssets: true,
    hasSvg: true,
  },

  devicons: {
    id: "devicons",
    name: "Devicons",
    description: "Programming language, framework, and developer tool icons.",
    website: "https://devicon.dev",
    assetsProvider: "devicons",
    hasAssets: true,
    hasSvg: true,
  },

  "simple-icons": {
    id: "simple-icons",
    name: "Simple Icons",
    description: "Brand icons for popular companies, products, and services.",
    website: "https://simpleicons.org",
    assetsProvider: "simple-icons-font",
    hasAssets: true,
    hasSvg: true,
  },

  octicons: {
    id: "octicons",
    name: "Octicons",
    description: "GitHub's icon library used throughout GitHub and Primer.",
    website: "https://primer.style/octicons",
    assetsProvider: "octicons",
    hasAssets: true,
    hasSvg: true,
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
