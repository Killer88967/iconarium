import type { IconName, IconSize } from "@iconarium/iconarium";
import { uiIcons } from "@/generated/iconarium";

interface IconProps<N extends IconName> {
  name: N;
  size?: IconSize<N>;
  className?: string;
  title?: string;
}

export default function Icon<N extends IconName>({
  name,
  size = 24 as IconSize<N>,
  className,
  title,
}: IconProps<N>) {
  const icons = uiIcons as Record<
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
      width={size}
      height={size}
      viewBox={`0 0 ${icon.width} ${size}`}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      fill="currentColor"
      dangerouslySetInnerHTML={{
        __html: title ? `<title>${title}</title>${icon.path}` : icon.path,
      }}
    />
  );
}
