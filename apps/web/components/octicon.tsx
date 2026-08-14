import type { OcticonName, OcticonSize } from "@iconarium/octicons";
import { uiOcticons } from "@/generated/octicons";

interface OcticonProps<N extends OcticonName> {
  name: N;
  size: OcticonSize<N>;
  className?: string;
}

export default function Octicon<N extends OcticonName>({
  name,
  size,
  className,
}: OcticonProps<N>) {
  const icons = uiOcticons as Record<
    string,
    Record<
      number,
      {
        width: number;
        path: string;
      }
    >
  >;

  const icon = icons[name]?.[size];

  if (!icon) {
    return null;
  }

  return (
    <svg
      className={className}
      width={icon.width}
      height={size}
      viewBox={`0 0 ${icon.width} ${size}`}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{
        __html: icon.path,
      }}
    />
  );
}
