"use client";

import { useEffect, useMemo, useState } from "react";

type Provider = "font-awesome" | "devicons" | "simple-icons";

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

type Icon = FontAwesomeIcon | DeviconIcon | SimpleIcon;

interface ProviderInfo {
  id: Provider;
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

const providers: Provider[] = ["font-awesome", "devicons", "simple-icons"];

function flattenMetadata(provider: Provider, metadata: Metadata): SearchIcon[] {
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

function providerName(provider: Provider) {
  switch (provider) {
    case "font-awesome":
      return "Font Awesome";

    case "devicons":
      return "Devicons";

    case "simple-icons":
      return "Simple Icons";
  }
}

export default function GlobalSearch() {
  const [icons, setIcons] = useState<SearchIcon[]>([]);

  const [query, setQuery] = useState("");

  const [provider, setProvider] = useState<Provider | "all">("all");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const responses = await Promise.all(
          providers.map(async (provider) => {
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
      <div className="global-search-controls">
        <input
          type="search"
          value={query}
          placeholder="Search GitHub, TypeScript, Facebook..."
          autoFocus
          onChange={(event) => setQuery(event.target.value)}
        />

        <select
          value={provider}
          onChange={(event) =>
            setProvider(event.target.value as Provider | "all")
          }
        >
          <option value="all">All providers</option>

          <option value="font-awesome">Font Awesome</option>

          <option value="devicons">Devicons</option>

          <option value="simple-icons">Simple Icons</option>
        </select>
      </div>

      {loading && <p>Loading icons…</p>}

      {error && <div className="browser-error">{error}</div>}

      {!loading && !error && !query.trim() && (
        <div className="search-placeholder">
          <p>
            Search across {icons.length.toLocaleString()} generated icon
            entries.
          </p>
        </div>
      )}

      {query.trim() && (
        <>
          <p className="result-count">
            Showing {results.length.toLocaleString()} result
            {results.length === 1 ? "" : "s"}
            {results.length === 200 ? " (first 200)" : ""}
          </p>

          <div className="global-search-results">
            {results.map(({ key, icon }) => (
              <a
                key={key}
                className="global-search-result"
                href={`/providers/${icon.provider}/${encodeURIComponent(icon.name)}`}
              >
                <div>
                  <strong>{icon.label}</strong>

                  <code>{icon.name}</code>
                </div>

                <span>{providerName(icon.provider)}</span>
              </a>
            ))}
          </div>

          {results.length === 0 && (
            <div className="empty-state">
              No icons matched <strong>{query}</strong>.
            </div>
          )}
        </>
      )}
    </section>
  );
}
