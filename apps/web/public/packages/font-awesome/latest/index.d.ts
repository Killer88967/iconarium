export const icons: {
  readonly brands: {
    readonly facebook: {
      readonly name: "facebook";
      readonly className: "fa-brands fa-facebook";
    };
  };
  readonly solid: {
    readonly house: {
      readonly name: "house";
      readonly className: "fa-solid fa-house";
    };
  };
};
export type FontAwesomeStyle = keyof typeof icons;
export type FontAwesomeIconName<S extends FontAwesomeStyle> =
  keyof (typeof icons)[S] & string;
export function getIcon<
  S extends FontAwesomeStyle,
  N extends FontAwesomeIconName<S>,
>(style: S, name: N): (typeof icons)[S][N];
export function hasIcon<S extends FontAwesomeStyle>(
  style: S,
  name: string,
): name is FontAwesomeIconName<S>;
export function createClassName<
  S extends FontAwesomeStyle,
  N extends FontAwesomeIconName<S>,
>(style: S, name: N): string | undefined;
