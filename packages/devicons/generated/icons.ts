// Seed data. `pnpm generate:devicons` replaces this file.
export const icons = {
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
  javascript: {
    name: "javascript",
    label: "JavaScript",
    provider: "devicons",
    aliases: [],
    categories: ["programming-language"],
    tags: ["javascript", "js"],
    deprecated: false,
    variants: ["original", "plain"],
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
} as const;

export const providerInfo = {
  id: "devicons",
  name: "Devicons",
  version: "seed",
  source: "https://github.com/devicons/devicon",
} as const;
