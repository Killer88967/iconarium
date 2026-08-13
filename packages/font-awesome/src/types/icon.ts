import type { IconMetadata } from "@icon-meta/core";
import type { FontAwesomeStyle } from "./style";

export interface FontAwesomeIconMetadata extends IconMetadata {
  provider: "font-awesome";
  styles: readonly FontAwesomeStyle[];
  unicode?: string;
}
