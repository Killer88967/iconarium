import type { FontAwesomeNormalized } from "../../core/types";
import type { FontAwesomeSourceIcon } from "./source";

export function normalizeFontAwesome(
  data: Record<string, FontAwesomeSourceIcon>,
) {
  const byStyle: Record<string, Record<string, FontAwesomeNormalized>> = {};

  for (const [name, icon] of Object.entries(data)) {
    for (const style of icon.free ?? []) {
      const normalized: FontAwesomeNormalized = {
        name,
        label: icon.label ?? name,
        provider: "font-awesome",
        style,
        prefix: `fa-${style}`,
        className: `fa-${style} fa-${name}`,
        unicode: icon.unicode,
        aliases: icon.aliases?.names ?? [],
        categories: [],
        tags: Array.from(new Set([name, ...(icon.search?.terms ?? [])])),
        deprecated: false,
      };
      (byStyle[style] ??= {})[name] = normalized;
    }
  }

  return byStyle;
}
