import type { IconName, IconSize } from "@iconarium/iconarium";
import { uiIcons } from "@/generated/iconarium";

interface GeneratedIconData {
  width: number;
  path: string;
}

interface IconProps<N extends IconName> {
  name: N;
  size?: IconSize<N>;
  className?: string;
  title?: string;
}

interface RuntimeIconProps {
  name: string;
  size?: number;
  className?: string;
  title?: string;
}

const icons = uiIcons as Record<
  string,
  Record<number, GeneratedIconData | undefined>
>;

export function RuntimeIcon({
  name,
  size = 24,
  className,
  title,
}: RuntimeIconProps) {
  const icon = icons[name]?.[size];

  if (!icon) {
    return null;
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${icon.width} ${size}`}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      fill="currentColor"
    >
      {title ? <title>{title}</title> : null}

      <g
        dangerouslySetInnerHTML={{
          __html: icon.path,
        }}
      />
    </svg>
  );
}

export default function Icon<N extends IconName>({
  name,
  size = 24 as IconSize<N>,
  className,
  title,
}: IconProps<N>) {
  return (
    <RuntimeIcon name={name} size={size} className={className} title={title} />
  );
}
