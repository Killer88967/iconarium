import type { FontAwesomeIconMetadata } from "../types";

export const brandIcons = {
  facebook: {
    name: "facebook",
    provider: "font-awesome",
    styles: ["brands"],
    categories: ["social"],
  },

  instagram: {
    name: "instagram",
    provider: "font-awesome",
    styles: ["brands"],
    categories: ["social"],
  },

  linkedin: {
    name: "linkedin",
    provider: "font-awesome",
    styles: ["brands"],
    categories: ["social"],
  },

  github: {
    name: "github",
    provider: "font-awesome",
    styles: ["brands"],
    categories: ["development"],
  },
} as const satisfies Record<string, FontAwesomeIconMetadata>;

export type BrandIconName = keyof typeof brandIcons;
