import { searchRecord } from "@iconarium/core";
import { icons, providerInfo } from "../generated/icons";

export { icons, providerInfo };
export type OcticonMap = typeof icons;
export type OcticonName = keyof OcticonMap;
export type OcticonSize<N extends OcticonName> = OcticonMap[N]["sizes"][number];

export function getIcon<N extends OcticonName, S extends OcticonSize<N>>(
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

export function hasIcon(name: string): name is OcticonName {
  return Object.prototype.hasOwnProperty.call(icons, name);
}

export function searchIcons(query: string) {
  return searchRecord(icons, query);
}
