"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProviderId } from "@/lib/providers";

interface ProviderInfo {
  id: ProviderId;
  name: string;
  version: string;
  source: string;
}

interface BaseIcon {
  name: string;
  label: string;
  provider: ProviderId;
  aliases: string[];
  categories: string[];
  tags: string[];
  deprecated: boolean;
}

interface FontAwesomeIcon extends BaseIcon {
  provider: "font-awesome";
  style: string;
  prefix: string;
  className: string;
  unicode?: string;
}

interface DeviconIcon extends BaseIcon {
  provider: "devicons";
  variants: string[];
  svgVariants: string[];
  fontVariants: string[];
}

interface SimpleIcon extends BaseIcon {
  provider: "simple-icons";
  hex: string;
  source: string;
  guidelines: string | null;
  license: {
    type: string;
    url?: string;
  } | null;
}

interface OcticonIcon extends BaseIcon {
  provider: "octicons";
  sizes: number[];
}

type Icon = FontAwesomeIcon | DeviconIcon | SimpleIcon | OcticonIcon;

type FlatIcons = Record<string, Icon>;

type FontAwesomeIcons = Record<string, Record<string, FontAwesomeIcon>>;

interface ProviderMetadata {
  providerInfo: ProviderInfo;
  icons: FlatIcons | FontAwesomeIcons;
}

interface IconDetailsProps {
  provider: ProviderId;
  iconName: string;
}

function findIcon(
  provider: ProviderId,
  iconName: string,
  icons: ProviderMetadata["icons"],
): Icon | null {
  if (provider !== "font-awesome") {
    return (icons as FlatIcons)[iconName] ?? null;
  }

  for (const style of Object.values(icons as FontAwesomeIcons)) {
    if (iconName in style) {
      return style[iconName];
    }
  }

  return null;
}

function getPreferredOcticonSize(icon: OcticonIcon) {
  return icon.sizes.includes(24)
    ? 24
    : icon.sizes.includes(16)
      ? 16
      : icon.sizes[0];
}

function makeUsage(icon: Icon, version: string) {
  const base = "https://iconarium.vercel.app/packages";

  if (icon.provider === "font-awesome") {
    return {
      latest: `import { getIcon } from "${base}/font-awesome/latest";

const icon = getIcon("${icon.style}", "${icon.name}");`,

      pinned: `import { getIcon } from "${base}/font-awesome/${version}";

const icon = getIcon("${icon.style}", "${icon.name}");`,
    };
  }

  if (icon.provider === "devicons") {
    const variant = icon.variants[0] ?? "";

    return {
      latest: `import { getIcon } from "${base}/devicons/latest";

const icon = getIcon("${icon.name}", "${variant}");`,

      pinned: `import { getIcon } from "${base}/devicons/${version}";

const icon = getIcon("${icon.name}", "${variant}");`,
    };
  }

  if (icon.provider === "octicons") {
    const size = getPreferredOcticonSize(icon);

    return {
      latest: `import { getIcon } from "${base}/octicons/latest";

const icon = getIcon("${icon.name}", ${size});`,

      pinned: `import { getIcon } from "${base}/octicons/${version}";

const icon = getIcon("${icon.name}", ${size});`,
    };
  }

  return {
    latest: `import { getIcon } from "${base}/simple-icons/latest";

const icon = getIcon("${icon.name}");`,

    pinned: `import { getIcon } from "${base}/simple-icons/${version}";

const icon = getIcon("${icon.name}");`,
  };
}

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

function LargeIconPreview({ icon, version }: { icon: Icon; version: string }) {
  let src: string | null = null;

  if (icon.provider === "font-awesome") {
    src = `/packages/font-awesome/${version}/svg/${icon.style}/${icon.name}.svg`;
  }

  if (icon.provider === "devicons") {
    const svgVariants = icon.svgVariants ?? icon.variants ?? [];

    const variant =
      svgVariants.find((value) => value.includes("original")) ?? svgVariants[0];

    if (variant) {
      src = `/packages/devicons/${version}/svg/${icon.name}/${variant}.svg`;
    }
  }

  if (icon.provider === "simple-icons") {
    src = `/packages/simple-icons/${version}/svg/${icon.name}.svg`;
  }

  if (icon.provider === "octicons") {
    const size = getPreferredOcticonSize(icon);

    if (size) {
      src = `/packages/octicons/${version}/svg/${icon.name}/${size}.svg`;
    }
  }

  return (
    <div className="large-icon-preview">
      {src ? (
        <img
          src={src}
          alt={`${icon.label} icon`}
          className={`icon-preview-image ${icon.provider}`}
        />
      ) : (
        <span>?</span>
      )}
    </div>
  );
}

export default function IconDetails({ provider, iconName }: IconDetailsProps) {
  const [metadata, setMetadata] = useState<ProviderMetadata | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(
          `/packages/${provider}/latest/metadata.json`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        setMetadata((await response.json()) as ProviderMetadata);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setError(
          error instanceof Error ? error.message : "Failed to load metadata.",
        );
      }
    }

    void load();

    return () => {
      controller.abort();
    };
  }, [provider]);

  const icon = useMemo(() => {
    if (!metadata) {
      return null;
    }

    return findIcon(provider, iconName, metadata.icons);
  }, [metadata, provider, iconName]);

  if (error) {
    return (
      <section>
        <div className="browser-error">{error}</div>
      </section>
    );
  }

  if (!metadata) {
    return (
      <section>
        <p>Loading icon metadata…</p>
      </section>
    );
  }

  if (!icon) {
    return (
      <section>
        <div className="empty-state">
          Icon <strong>{iconName}</strong> was not found.
        </div>
      </section>
    );
  }

  const usage = makeUsage(icon, metadata.providerInfo.version);

  return (
    <section className="icon-details-page">
      <div className="icon-summary">
        <LargeIconPreview icon={icon} version={metadata.providerInfo.version} />

        <div className="icon-summary-copy">
          <span className="section-kicker">{metadata.providerInfo.name}</span>

          <h2>{icon.label}</h2>

          <p>
            Provider version <strong>{metadata.providerInfo.version}</strong>
          </p>
        </div>

        {icon.provider === "simple-icons" && (
          <div
            className="brand-color"
            style={{
              backgroundColor: `#${icon.hex}`,
            }}
            title={`#${icon.hex}`}
          />
        )}
      </div>

      <div className="metadata-grid">
        <Metadata label="Name" value={icon.name} />

        <Metadata label="Provider" value={icon.provider} />

        {icon.provider === "font-awesome" && (
          <>
            <Metadata label="Style" value={icon.style} />

            <Metadata label="Class" value={icon.className} />

            <Metadata label="Unicode" value={icon.unicode ?? "—"} />
          </>
        )}

        {icon.provider === "devicons" && (
          <>
            <Metadata label="Variants" value={icon.variants.join(", ")} />

            <Metadata
              label="SVG Variants"
              value={
                icon.svgVariants.length ? icon.svgVariants.join(", ") : "—"
              }
            />

            <Metadata
              label="Font Variants"
              value={
                icon.fontVariants.length ? icon.fontVariants.join(", ") : "—"
              }
            />
          </>
        )}

        {icon.provider === "simple-icons" && (
          <>
            <Metadata label="Hex" value={`#${icon.hex}`} />

            <Metadata label="Source" value={icon.source} />

            <Metadata label="License" value={icon.license?.type ?? "—"} />
          </>
        )}

        {icon.provider === "octicons" && (
          <Metadata
            label="Sizes"
            value={
              icon.sizes.length
                ? icon.sizes.map((size) => `${size}px`).join(", ")
                : "—"
            }
          />
        )}

        <Metadata
          label="Aliases"
          value={icon.aliases.length ? icon.aliases.join(", ") : "—"}
        />

        <Metadata
          label="Categories"
          value={icon.categories.length ? icon.categories.join(", ") : "—"}
        />
      </div>

      <div className="usage-examples">
        <UsageBlock title="Latest" value={usage.latest} />

        <UsageBlock
          title={`Pinned · ${metadata.providerInfo.version}`}
          value={usage.pinned}
        />
      </div>

      {icon.tags.length > 0 && (
        <div className="icon-tags">
          <span className="section-kicker">Tags</span>

          <div className="tag-list">
            {icon.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Metadata({ label, value }: { label: string; value: string }) {
  return (
    <div className="metadata-item">
      <span>{label}</span>
      <code>{value}</code>
    </div>
  );
}

function UsageBlock({ title, value }: { title: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await copyText(value);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <div className="usage-block">
      <div className="usage-block-heading">
        <h3>{title}</h3>

        <button type="button" onClick={copy}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <pre>
        <code>{value}</code>
      </pre>
    </div>
  );
}
