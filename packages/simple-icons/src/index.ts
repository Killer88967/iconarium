import { searchRecord } from "@icon-meta/core";
import { icons, providerInfo } from "../generated/icons";

export { icons, providerInfo };

export type SimpleIconMap = typeof icons;
export type SimpleIconName = keyof SimpleIconMap;

export function getIcon<N extends SimpleIconName>(name: N): SimpleIconMap[N] {
  return icons[name];
}

export function hasIcon(name: string): name is SimpleIconName {
  return Object.prototype.hasOwnProperty.call(icons, name);
}

export function searchIcons(query: string) {
  return searchRecord(icons, query);
}
