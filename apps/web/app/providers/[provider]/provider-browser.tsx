"use client";

import { useEffect, useMemo, useState } from "react";

type Provider = "font-awesome" | "devicons" | "simple-icons";

interface ProviderInfo {
  id: Provider;
  name: string;
  version: string;
  source: string;
}

interface BaseIcon {
  name: string;
  label: string;
  provider: Provider;
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

type Icon = FontAwesomeIcon | DeviconIcon | SimpleIcon;

type FlatIcons = Record<string, Icon>;

type FontAwesomeIcons = Record<string, Record<string, FontAwesomeIcon>>;

interface ProviderMetadata {
  providerInfo: ProviderInfo;

  icons: FlatIcons | FontAwesomeIcons;
}

interface ProviderBrowserProps {
  provider: Provider;
}

function flattenIcons(
  provider: Provider,
  icons: ProviderMetadata["icons"],
): Icon[] {
  if (provider !== "font-awesome") {
    return Object.values(icons as FlatIcons);
  }

  return Object.values(icons as FontAwesomeIcons).flatMap((style) =>
    Object.values(style),
  );
}

function matchesSearch(icon: Icon, search: string) {
  if (!search) {
    return true;
  }

  const values = [
    icon.name,
    icon.label,
    ...icon.aliases,
    ...icon.categories,
    ...icon.tags,
  ];

  return values.some((value) => value.toLowerCase().includes(search));
}

function IconDetails({ icon }: { icon: Icon }) {
  if (icon.provider === "font-awesome") {
    return (
      <>
        <span>{icon.style}</span>
        <code>{icon.className}</code>
      </>
    );
  }

  if (icon.provider === "devicons") {
    return (
      <>
        <span>
          {icon.variants.length}{" "}
          {icon.variants.length === 1 ? "variant" : "variants"}
        </span>

        <code>{icon.variants[0] ?? "—"}</code>
      </>
    );
  }

  return (
    <>
      <span>#{icon.hex}</span>
      <code>{icon.name}</code>
    </>
  );
}

function IconPreview({ icon, version }: { icon: Icon; version: string }) {
  let src: string | null = null;

  if (icon.provider === "font-awesome") {
    src = `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@${version}/svgs/${icon.style}/${icon.name}.svg`;
  }

  if (icon.provider === "devicons") {
    const variant =
      icon.svgVariants.find((value) => value.includes("original")) ??
      icon.svgVariants[0];

    if (variant) {
      src = `https://cdn.jsdelivr.net/npm/devicon@${version}/icons/${icon.name}/${icon.name}-${variant}.svg`;
    }
  }

  if (icon.provider === "simple-icons") {
    src = `https://cdn.jsdelivr.net/npm/simple-icons@${version}/icons/${icon.name}.svg`;
  }

  return (
    <div className="icon-preview">
      {src ? <img src={src} alt="" loading="lazy" /> : <span>?</span>}
    </div>
  );
}

export default function ProviderBrowser({ provider }: ProviderBrowserProps) {
  const [metadata, setMetadata] = useState<ProviderMetadata | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setError(null);

        const response = await fetch(
          `/packages/${provider}/latest/metadata.json`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = (await response.json()) as ProviderMetadata;

        setMetadata(data);
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

  const icons = useMemo(() => {
    if (!metadata) {
      return [];
    }

    return flattenIcons(provider, metadata.icons);
  }, [metadata, provider]);

  const filteredIcons = useMemo(() => {
    const search = query.trim().toLowerCase();

    return icons.filter((icon) => matchesSearch(icon, search));
  }, [icons, query]);

  if (error) {
    return (
      <section>
        <div className="browser-error">
          <strong>Could not load provider metadata.</strong>

          <code>{error}</code>
        </div>
      </section>
    );
  }

  if (!metadata) {
    return (
      <section>
        <p>Loading provider metadata…</p>
      </section>
    );
  }

  return (
    <section className="icon-browser">
      <div className="browser-toolbar">
        <div>
          <span className="section-kicker">
            {metadata.providerInfo.version}
          </span>

          <h2>{icons.length.toLocaleString()} icons</h2>
        </div>

        <input
          type="search"
          value={query}
          placeholder="Search icons…"
          aria-label="Search icons"
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <p className="result-count">
        Showing {filteredIcons.length.toLocaleString()} of{" "}
        {icons.length.toLocaleString()}
      </p>

      <div className="icon-grid">
        {filteredIcons.map((icon) => (
          <a
            className="icon-card"
            key={`${icon.provider}-${"style" in icon ? icon.style : ""}-${icon.name}`}
            href={`/providers/${provider}/${encodeURIComponent(icon.name)}`}
          >
            <IconPreview icon={icon} version={metadata.providerInfo.version} />

            <div className="icon-card-heading">
              <strong>{icon.label}</strong>

              <span>{icon.name}</span>
            </div>

            <div className="icon-card-details">
              <IconDetails icon={icon} />
            </div>

            {icon.tags.length > 0 && (
              <div className="tag-list">
                {icon.tags.slice(0, 4).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>

      {filteredIcons.length === 0 && (
        <div className="empty-state">
          No icons matched <strong>{query}</strong>.
        </div>
      )}
    </section>
  );
}
