import { searchRecord } from "@iconarium/core";
import { icons, providerInfo } from "../generated/icons";

export { icons, providerInfo };

export type IconariumIconMap = typeof icons;
export type IconariumIconName = keyof IconariumIconMap;

export function getIcon<N extends IconariumIconName>(
  name: N,
): IconariumIconMap[N] {
  return icons[name];
}

export function hasIcon(name: string): name is IconariumIconName {
  return Object.prototype.hasOwnProperty.call(icons, name);
}

export function searchIcons(query: string) {
  return searchRecord(icons, query);
}
