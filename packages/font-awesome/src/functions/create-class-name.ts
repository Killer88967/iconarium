import type {
  BrandIconName,
  RegularIconName,
  SolidIconName,
} from "../metadata";

export function createBrandClassName(icon: BrandIconName): string {
  return `fa-brands fa-${icon}`;
}

export function createSolidClassName(icon: SolidIconName): string {
  return `fa-solid fa-${icon}`;
}

export function createRegularClassName(icon: RegularIconName): string {
  return `fa-regular fa-${icon}`;
}
