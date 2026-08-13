export interface IconMetadataBase {
  readonly name: string;
  readonly label: string;
  readonly provider: string;
  readonly aliases: readonly string[];
  readonly categories: readonly string[];
  readonly tags: readonly string[];
  readonly deprecated: boolean;
}

export interface ProviderInfo {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly source: string;
}

export type IconRecord<T> = Readonly<Record<string, T>>;
