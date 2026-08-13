export interface IconMetadataBase {
  readonly name: string;
  readonly label: string;
  readonly provider: string;
  readonly aliases: readonly string[];
  readonly categories: readonly string[];
  readonly tags: readonly string[];
  readonly deprecated: boolean;
}

export interface SimpleIconMetadata extends IconMetadataBase {
  readonly provider: "simple-icons";
  readonly hex: string;
  readonly source: string;
  readonly guidelines: string | null;
  readonly license: {
    readonly type: string;
    readonly url?: string;
  } | null;
}

export interface ProviderInfo {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly source: string;
}

export type IconRecord<T> = Readonly<Record<string, T>>;
