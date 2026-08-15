"use client";

import { useEffect, useMemo, useState } from "react";
import { providerIds, providers, type ProviderId } from "@/lib/providers";
import StatusPanel from "@/components/status-panel";
import Octicon from "@/components/octicon";

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
}

interface DeviconIcon extends BaseIcon {
  provider: "devicons";
  variants: string[];
  svgVariants?: string[];
  fontVariants?: string[];
}

interface SimpleIcon extends BaseIcon {
  provider: "simple-icons";
  hex: string;
  source: string;
}

interface OcticonIcon extends BaseIcon {
  provider: "octicons";
  sizes: number[];
}

type Icon = FontAwesomeIcon | DeviconIcon | SimpleIcon | OcticonIcon;

interface ProviderInfo {
  id: ProviderId;
  name: string;
  version: string;
}

interface Metadata {
  providerInfo: ProviderInfo;
  icons: unknown;
}

interface SearchIcon {
  key: string;
  icon: Icon;
}

function flattenMetadata(
  provider: ProviderId,
  metadata: Metadata,
): SearchIcon[] {
  if (provider === "font-awesome") {
    const styles = metadata.icons as Record<
      string,
      Record<string, FontAwesomeIcon>
    >;

    return Object.entries(styles).flatMap(([style, icons]) =>
      Object.values(icons).map((icon) => ({
        key: `${provider}:${style}:${icon.name}`,
        icon,
      })),
    );
  }

  const icons = metadata.icons as Record<string, Icon>;

  return Object.values(icons).map((icon) => ({
    key: `${provider}:${icon.name}`,
    icon,
  }));
}

function matchesSearch(icon: Icon, query: string) {
  const values = [
    icon.name,
    icon.label,
    ...icon.aliases,
    ...icon.categories,
    ...icon.tags,
  ];

  return values.some((value) => value.toLowerCase().includes(query));
}

function SearchIconPreview({ icon }: { icon: Icon }) {
  let src: string | null = null;

  if (icon.provider === "font-awesome") {
    src =
      "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@latest" +
      `/svgs/${icon.style}/${icon.name}.svg`;
  }

  if (icon.provider === "devicons") {
    const svgVariants = icon.svgVariants ?? icon.variants ?? [];

    const variant =
      svgVariants.find((value) => value.includes("original")) ?? svgVariants[0];

    if (variant) {
      src =
        "https://cdn.jsdelivr.net/npm/devicon@latest" +
        `/icons/${icon.name}/${icon.name}-${variant}.svg`;
    }
  }

  if (icon.provider === "simple-icons") {
    src =
      "https://cdn.jsdelivr.net/npm/simple-icons@latest" +
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
        "https://raw.githubusercontent.com/primer/octicons/main" +
        `/icons/${icon.name}-${size}.svg`;
    }
  }

  return (
    <div className="global-search-icon">
      {src ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          className={`global-search-icon-image ${icon.provider}`}
        />
      ) : (
        <span>?</span>
      )}
    </div>
  );
}

export default function GlobalSearch() {
  const [icons, setIcons] = useState<SearchIcon[]>([]);
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState<ProviderId | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const responses = await Promise.all(
          providerIds.map(async (provider) => {
            const response = await fetch(
              `/packages/${provider}/latest/metadata.json`,
              {
                signal: controller.signal,
              },
            );

            if (!response.ok) {
              throw new Error(`${provider}: HTTP ${response.status}`);
            }

            const metadata = (await response.json()) as Metadata;

            return flattenMetadata(provider, metadata);
          }),
        );

        setIcons(responses.flat());
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load icon metadata.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      controller.abort();
    };
  }, []);

  const results = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return [];
    }

    return icons
      .filter(({ icon }) => {
        if (provider !== "all" && icon.provider !== provider) {
          return false;
        }

        return matchesSearch(icon, search);
      })
      .slice(0, 200);
  }, [icons, query, provider]);

  return (
    <section className="global-search">
      <div className="global-search-toolbar">
        <div className="global-search-input">
          <Octicon name="search" size={16} />

          <input
            type="search"
            value={query}
            placeholder="Search GitHub, TypeScript, Facebook..."
            autoFocus
            aria-label="Search icons"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <select
          value={provider}
          aria-label="Filter by provider"
          onChange={(event) =>
            setProvider(event.target.value as ProviderId | "all")
          }
        >
          <option value="all">All providers</option>

          {providerIds.map((providerId) => (
            <option value={providerId} key={providerId}>
              {providers[providerId].name}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="search-placeholder">
          <Octicon name="sync" size={16} />
          <p>Loading icon metadata…</p>
        </div>
      )}

      {error && <div className="browser-error">{error}</div>}

      {!loading && !error && !query.trim() && (
        <div className="search-placeholder">
          <Octicon name="search" size={16} />

          <div>
            <strong>Search Iconarium</strong>

            <p>
              Search across {icons.length.toLocaleString()} generated icon
              entries from {providerIds.length} providers.
            </p>
          </div>
        </div>
      )}

      {query.trim() && (
        <>
          <div className="global-search-results-header">
            <span>
              {results.length.toLocaleString()} result
              {results.length === 1 ? "" : "s"}
              {results.length === 200 ? " · first 200" : ""}
            </span>

            <span>
              Search: <code>{query}</code>
            </span>
          </div>

          <div className="global-search-results">
            {results.map(({ key, icon }) => (
              <a
                key={key}
                className="global-search-result"
                href={`/providers/${icon.provider}/${encodeURIComponent(icon.name)}`}
              >
                <SearchIconPreview icon={icon} />

                <div className="global-search-result-copy">
                  <strong>{icon.label}</strong>
                  <code>{icon.name}</code>
                </div>

                <div className="global-search-result-meta">
                  <span className="global-search-provider">
                    {providers[icon.provider].name}
                  </span>

                  <Octicon name="chevron-right" size={16} />
                </div>
              </a>
            ))}
          </div>

          {results.length === 0 && (
            <StatusPanel
              kind="empty"
              title="No icons found"
              description={`No icons matched "${query}".`}
            />
          )}
        </>
      )}
    </section>
  );
}
