import type { FontAwesomeIconMetadata } from "../types";

export const regularIcons = {
  user: {
    name: "user",
    provider: "font-awesome",
    styles: ["regular"],
  },

  heart: {
    name: "heart",
    provider: "font-awesome",
    styles: ["regular"],
  },
} as const satisfies Record<string, FontAwesomeIconMetadata>;

export type RegularIconName = keyof typeof regularIcons;
