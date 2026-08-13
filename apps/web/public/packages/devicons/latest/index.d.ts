export const icons: {
  readonly typescript: {
    readonly name: "typescript";
    readonly variants: readonly [
      "original",
      "plain",
      "original-wordmark",
      "plain-wordmark",
    ];
  };
  readonly rust: {
    readonly name: "rust";
    readonly variants: readonly ["original", "plain", "line"];
  };
};
export type DeviconName = keyof typeof icons;
export type DeviconVariant<N extends DeviconName> =
  (typeof icons)[N]["variants"][number];
export function getIcon<N extends DeviconName, V extends DeviconVariant<N>>(
  name: N,
  variant: V,
): (typeof icons)[N] & { variant: V; className: string };
export function hasIcon(name: string): name is DeviconName;
export function createClassName<
  N extends DeviconName,
  V extends DeviconVariant<N>,
>(name: N, variant: V): string | undefined;
