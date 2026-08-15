"use client";

import { useEffect, useMemo, useState } from "react";
import StatusPanel from "@/components/status-panel";
import Icon from "@/components/icon";
import Octicon from "@/components/octicon";
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

interface IconariumIcon extends BaseIcon {
  provider: "iconarium";
  sizes: number[];
}

type Icon =
  FontAwesomeIcon | DeviconIcon | SimpleIcon | OcticonIcon | IconariumIcon;

type FlatIcons = Record<string, Icon>;

type FontAwesomeIcons = Record<string, Record<string, FontAwesomeIcon>>;

interface ProviderMetadata {
  providerInfo: ProviderInfo;
  icons: FlatIcons | FontAwesomeIcons;
}

interface ProviderBrowserProps {
  provider: ProviderId;
}

function flattenIcons(
  provider: ProviderId,
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

  if (icon.provider === "simple-icons") {
    return (
      <>
        <span>#{icon.hex}</span>
        <code>{icon.name}</code>
      </>
    );
  }

  if (icon.provider === "octicons" || icon.provider === "iconarium") {
    return (
      <>
        <span>
          {icon.sizes.length} {icon.sizes.length === 1 ? "size" : "sizes"}
        </span>

        <code>
          {icon.sizes.length > 0
            ? icon.sizes.map((size) => `${size}px`).join(", ")
            : "—"}
        </code>
      </>
    );
  }

  return null;
}

function IconPreview({ icon, version }: { icon: Icon; version: string }) {
  let src: string | null = null;

  if (icon.provider === "font-awesome") {
    src =
      `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@${version}` +
      `/svgs/${icon.style}/${icon.name}.svg`;
  }

  if (icon.provider === "devicons") {
    const svgVariants = icon.svgVariants ?? icon.variants ?? [];

    const variant =
      svgVariants.find((value) => value.includes("original")) ?? svgVariants[0];

    if (variant) {
      src =
        `https://cdn.jsdelivr.net/npm/devicon@${version}` +
        `/icons/${icon.name}/${icon.name}-${variant}.svg`;
    }
  }

  if (icon.provider === "simple-icons") {
    src =
      `https://cdn.jsdelivr.net/npm/simple-icons@${version}` +
      `/icons/${icon.name}.svg`;
  }

  if (icon.provider === "octicons") {
    const size = icon.sizes.includes(24)
      ? 24
      : icon.sizes.includes(16)
        ? 16
        : icon.sizes[0];

    if (size) {
      src =
        `https://raw.githubusercontent.com/primer/octicons/v${version}` +
        `/icons/${icon.name}-${size}.svg`;
    }
  }

  if (icon.provider === "iconarium") {
    return (
      <div className="icon-preview">
        <Icon
          name={icon.name as "iconarium"}
          size={24}
          className="icon-preview-image iconarium"
        />
      </div>
    );
  }

  return (
    <div className="icon-preview">
      {src ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          className={`icon-preview-image ${icon.provider}`}
        />
      ) : (
        <span>?</span>
      )}
    </div>
  );
}

export default function ProviderBrowser({ provider }: ProviderBrowserProps) {
  const [metadata, setMetadata] = useState<ProviderMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [fontAwesomeStyle, setFontAwesomeStyle] = useState("all");
  const [deviconVariant, setDeviconVariant] = useState("all");
  const [simpleIconCategory, setSimpleIconCategory] = useState("all");
  const [octiconSize, setOcticonSize] = useState("all");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setError(null);

        const response = await fetch(
          `/packages/${provider}/latest/metadata.json`,
          {
            signal: controller.signal,
            cache: "no-store",
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

  const fontAwesomeStyles = useMemo(() => {
    if (provider !== "font-awesome") {
      return [];
    }

    return Array.from(
      new Set(
        icons
          .filter(
            (icon): icon is FontAwesomeIcon => icon.provider === "font-awesome",
          )
          .map((icon) => icon.style),
      ),
    ).sort();
  }, [icons, provider]);

  const deviconVariants = useMemo(() => {
    if (provider !== "devicons") {
      return [];
    }

    return Array.from(
      new Set(
        icons
          .filter((icon): icon is DeviconIcon => icon.provider === "devicons")
          .flatMap((icon) => icon.variants),
      ),
    ).sort();
  }, [icons, provider]);

  const simpleIconCategories = useMemo(() => {
    if (provider !== "simple-icons") {
      return [];
    }

    return Array.from(
      new Set(
        icons
          .filter(
            (icon): icon is SimpleIcon => icon.provider === "simple-icons",
          )
          .flatMap((icon) => icon.categories),
      ),
    ).sort();
  }, [icons, provider]);

  const octiconSizes = useMemo(() => {
    if (provider !== "octicons") {
      return [];
    }

    return Array.from(
      new Set(
        icons
          .filter((icon): icon is OcticonIcon => icon.provider === "octicons")
          .flatMap((icon) => icon.sizes),
      ),
    ).sort((a, b) => a - b);
  }, [icons, provider]);

  const filteredIcons = useMemo(() => {
    const search = query.trim().toLowerCase();

    return icons.filter((icon) => {
      if (!matchesSearch(icon, search)) {
        return false;
      }

      if (
        icon.provider === "font-awesome" &&
        fontAwesomeStyle !== "all" &&
        icon.style !== fontAwesomeStyle
      ) {
        return false;
      }

      if (
        icon.provider === "devicons" &&
        deviconVariant !== "all" &&
        !icon.variants.includes(deviconVariant)
      ) {
        return false;
      }

      if (
        icon.provider === "simple-icons" &&
        simpleIconCategory !== "all" &&
        !icon.categories.includes(simpleIconCategory)
      ) {
        return false;
      }

      if (
        icon.provider === "octicons" &&
        octiconSize !== "all" &&
        !icon.sizes.includes(Number(octiconSize))
      ) {
        return false;
      }

      return true;
    });
  }, [
    icons,
    query,
    fontAwesomeStyle,
    deviconVariant,
    simpleIconCategory,
    octiconSize,
  ]);

  if (error) {
    return (
      <section>
        <StatusPanel
          kind="error"
          title="Could not load provider metadata"
          description={error}
        />
      </section>
    );
  }

  if (!metadata) {
    return (
      <section>
        <StatusPanel
          kind="loading"
          title="Loading provider metadata"
          description="Fetching the latest generated provider metadata."
        />
      </section>
    );
  }

  return (
    <section className="icon-browser">
      <div className="browser-header">
        <div>
          <span className="section-kicker">
            Version {metadata.providerInfo.version}
          </span>

          <h2>{metadata.providerInfo.name}</h2>
        </div>

        <span className="browser-count-badge">
          {icons.length.toLocaleString()} icons
        </span>
      </div>

      <div className="browser-toolbar">
        <div className="browser-search">
          <Octicon name="search" size={16} />

          <input
            type="search"
            value={query}
            placeholder={`Search ${metadata.providerInfo.name}…`}
            aria-label="Search icons"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="browser-controls">
          {provider === "font-awesome" && (
            <select
              value={fontAwesomeStyle}
              aria-label="Filter by Font Awesome style"
              onChange={(event) => setFontAwesomeStyle(event.target.value)}
            >
              <option value="all">All styles</option>

              {fontAwesomeStyles.map((style) => (
                <option value={style} key={style}>
                  {style}
                </option>
              ))}
            </select>
          )}

          {provider === "devicons" && (
            <select
              value={deviconVariant}
              aria-label="Filter by Devicon variant"
              onChange={(event) => setDeviconVariant(event.target.value)}
            >
              <option value="all">All variants</option>

              {deviconVariants.map((variant) => (
                <option value={variant} key={variant}>
                  {variant}
                </option>
              ))}
            </select>
          )}

          {provider === "simple-icons" && simpleIconCategories.length > 0 && (
            <select
              value={simpleIconCategory}
              aria-label="Filter by category"
              onChange={(event) => setSimpleIconCategory(event.target.value)}
            >
              <option value="all">All categories</option>

              {simpleIconCategories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          )}

          {provider === "octicons" && octiconSizes.length > 0 && (
            <select
              value={octiconSize}
              aria-label="Filter by Octicon size"
              onChange={(event) => setOcticonSize(event.target.value)}
            >
              <option value="all">All sizes</option>

              {octiconSizes.map((size) => (
                <option value={size} key={size}>
                  {size}px
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="browser-results-bar">
        <span>
          {filteredIcons.length.toLocaleString()} result
          {filteredIcons.length === 1 ? "" : "s"}
        </span>

        {query && (
          <span>
            Matching <code>{query}</code>
          </span>
        )}
      </div>

      <div className="icon-grid">
        {filteredIcons.map((icon) => (
          <a
            className="icon-card"
            key={`${icon.provider}-${"style" in icon ? icon.style : ""}-${icon.name}`}
            href={`/providers/${provider}/${encodeURIComponent(icon.name)}`}
          >
            <div className="icon-card-preview">
              <IconPreview
                icon={icon}
                version={metadata.providerInfo.version}
              />
            </div>

            <div className="icon-card-content">
              <div className="icon-card-heading">
                <strong>{icon.label}</strong>
                <code>{icon.name}</code>
              </div>

              <div className="icon-card-details">
                <IconDetails icon={icon} />
              </div>
            </div>
          </a>
        ))}
      </div>

      {filteredIcons.length === 0 && (
        <StatusPanel
          kind="empty"
          title="No icons found"
          description={
            query
              ? `No icons matched "${query}".`
              : "No icons match the selected filters."
          }
        />
      )}
    </section>
  );
}
