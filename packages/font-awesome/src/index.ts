import { searchRecord } from "@iconarium/core";
import { icons, providerInfo } from "../generated/icons";

export { icons, providerInfo };

export type FontAwesomeIconMap = typeof icons;
export type FontAwesomeStyle = keyof FontAwesomeIconMap;
export type FontAwesomeIconName<S extends FontAwesomeStyle> =
  keyof FontAwesomeIconMap[S] & string;
export type FontAwesomeIcon<
  S extends FontAwesomeStyle,
  N extends FontAwesomeIconName<S>,
> = FontAwesomeIconMap[S][N];

export function getIcon<
  S extends FontAwesomeStyle,
  N extends FontAwesomeIconName<S>,
>(style: S, name: N): FontAwesomeIcon<S, N> {
  return icons[style][name];
}

export function createClassName<
  S extends FontAwesomeStyle,
  N extends FontAwesomeIconName<S>,
>(style: S, name: N): string {
  return (getIcon(style, name) as { readonly className: string }).className;
}

export function hasIcon<S extends FontAwesomeStyle>(
  style: S,
  name: string,
): name is FontAwesomeIconName<S> {
  return Object.prototype.hasOwnProperty.call(icons[style], name);
}

export function searchIcons<S extends FontAwesomeStyle>(
  style: S,
  query: string,
) {
  return searchRecord(
    icons[style] as Readonly<
      Record<
        string,
        {
          readonly name: string;
          readonly label: string;
          readonly aliases: readonly string[];
          readonly tags: readonly string[];
        }
      >
    >,
    query,
  );
}
