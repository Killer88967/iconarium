export interface NormalizedBase {
  name: string;
  label: string;
  provider: string;
  aliases: string[];
  categories: string[];
  tags: string[];
  deprecated: boolean;
}

export interface FontAwesomeNormalized extends NormalizedBase {
  provider: "font-awesome";
  style: string;
  prefix: string;
  className: string;
  unicode?: string;
}

export interface DeviconNormalized extends NormalizedBase {
  provider: "devicons";
  variants: string[];
  svgVariants: string[];
  fontVariants: string[];
}

export interface SimpleIconNormalized extends NormalizedBase {
  provider: "simple-icons";
  hex: string;
  source: string;
  guidelines: string | null;
  license: { type: string; url?: string } | null;
}

export interface OcticonNormalized extends NormalizedBase {
  provider: "octicons";
  sizes: number[];
}

export interface IconariumNormalized extends NormalizedBase {
  provider: "iconarium";
  sizes: number[];
}

export interface SourceResult<T> {
  version: string;
  source: string;
  data: T;
}
