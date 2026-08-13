export interface IconMetadata {
  name: string;
  provider: string;

  aliases?: readonly string[];
  categories?: readonly string[];
  tags?: readonly string[];

  deprecated?: boolean;
}
