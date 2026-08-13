import type { IconMetadata } from "./icon";

export interface IconProvider<
  TName extends string = string,
  TIcon extends IconMetadata = IconMetadata,
> {
  readonly name: string;
  readonly version: string;

  readonly icons: Readonly<Record<TName, TIcon>>;

  has(name: string): name is TName;

  get(name: TName): TIcon;
}
