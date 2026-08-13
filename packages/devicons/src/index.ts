import { searchRecord } from "@icon-meta/core";
import { icons, providerInfo } from "../generated/icons";

export { icons, providerInfo };

export type DeviconMap = typeof icons;
export type DeviconName = keyof DeviconMap;
export type DeviconVariant<N extends DeviconName> =
  DeviconMap[N]["variants"][number];

export function getIcon<N extends DeviconName, V extends DeviconVariant<N>>(
  name: N,
  variant: V,
) {
  const metadata = icons[name];
  return {
    ...metadata,
    variant,
    className: `devicon-${name}-${variant}` as const,
  };
}

export function createClassName<
  N extends DeviconName,
  V extends DeviconVariant<N>,
>(name: N, variant: V): string {
  return `devicon-${name}-${variant}`;
}

export function hasIcon(name: string): name is DeviconName {
  return Object.prototype.hasOwnProperty.call(icons, name);
}

export function searchIcons(query: string) {
  return searchRecord(icons, query);
}
