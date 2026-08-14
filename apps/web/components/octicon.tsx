import fs from "node:fs";
import path from "node:path";

import type { OcticonName, OcticonSize } from "@iconarium/octicons";

interface OcticonHeightData {
  width: number;
  path: string;
}

interface OcticonData {
  heights: Record<string, OcticonHeightData>;
}

type OcticonsData = Record<string, OcticonData>;

interface OcticonProps<N extends OcticonName> {
  name: N;
  size: OcticonSize<N>;
  className?: string;
}

let cachedOcticons: OcticonsData | null = null;

function getOcticonsData(): OcticonsData {
  if (cachedOcticons) {
    return cachedOcticons;
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    "packages",
    "octicons",
    "latest",
    "build",
    "data.json",
  );

  cachedOcticons = JSON.parse(
    fs.readFileSync(filePath, "utf8"),
  ) as OcticonsData;

  return cachedOcticons;
}

export default function Octicon<N extends OcticonName>({
  name,
  size,
  className,
}: OcticonProps<N>) {
  const octicons = getOcticonsData();

  const icon = octicons[name];
  const height = icon?.heights[String(size)];

  if (!height) {
    return null;
  }

  return (
    <svg
      className={className}
      width={height.width}
      height={size}
      viewBox={`0 0 ${height.width} ${size}`}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: height.path }}
    />
  );
}
