import { searchRecord, type SimpleIconMetadata } from "@iconarium/core";

import { icons, providerInfo, type SimpleIconName } from "../generated/icons";

export { icons, providerInfo };

export type { SimpleIconName };

export type SimpleIconMap = Readonly<
  Record<SimpleIconName, SimpleIconMetadata>
>;

export function getIcon(name: SimpleIconName): SimpleIconMetadata {
  return icons[name];
}

export function hasIcon(name: string): name is SimpleIconName {
  return Object.prototype.hasOwnProperty.call(icons, name);
}

export function searchIcons(query: string): SimpleIconMetadata[] {
  return searchRecord(icons, query) as SimpleIconMetadata[];
}
