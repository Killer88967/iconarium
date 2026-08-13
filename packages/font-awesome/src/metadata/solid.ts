import type { FontAwesomeIconMetadata } from "../types";

export const solidIcons = {
  house: {
    name: "house",
    provider: "font-awesome",
    styles: ["solid"],
  },

  user: {
    name: "user",
    provider: "font-awesome",
    styles: ["solid"],
  },

  gear: {
    name: "gear",
    provider: "font-awesome",
    styles: ["solid"],
  },
} as const satisfies Record<string, FontAwesomeIconMetadata>;

export type SolidIconName = keyof typeof solidIcons;
