import { searchRecord } from "@iconarium/core";
import { icons, providerInfo } from "../generated/icons";

export { icons, providerInfo };

export type IconMap = typeof icons;
export type IconName = keyof IconMap;
export type IconSize<N extends IconName> = IconMap[N]["sizes"][number];

export function getIcon<N extends IconName, S extends IconSize<N>>(
  name: N,
  size: S,
) {
  const metadata = icons[name];

  return {
    ...metadata,
    size,
    fileName: `${name}-${size}.svg` as const,
  };
}

export function hasIcon(name: string): name is IconName {
  return Object.prototype.hasOwnProperty.call(icons, name);
}

export function searchIcons(query: string) {
  return searchRecord(icons, query);
}
