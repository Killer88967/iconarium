export const icons: {
  readonly github: { readonly name: "github"; readonly hex: "181717" };
  readonly typescript: { readonly name: "typescript"; readonly hex: "3178C6" };
};
export type SimpleIconName = keyof typeof icons;
export function getIcon<N extends SimpleIconName>(name: N): (typeof icons)[N];
export function hasIcon(name: string): name is SimpleIconName;
