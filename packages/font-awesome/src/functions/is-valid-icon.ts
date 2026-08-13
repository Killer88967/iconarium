import { brandIcons, regularIcons, solidIcons } from "../metadata";

export function isBrandIcon(name: string): name is keyof typeof brandIcons {
  return name in brandIcons;
}

export function isSolidIcon(name: string): name is keyof typeof solidIcons {
  return name in solidIcons;
}

export function isRegularIcon(name: string): name is keyof typeof regularIcons {
  return name in regularIcons;
}
