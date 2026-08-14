"use client";

import { useEffect, useMemo, useState } from "react";

type AssetProvider =
  "font-awesome" | "devicons" | "simple-icons-font" | "octicons";

interface AssetManifest {
  provider: string;
  version: string;

  assets: {
    css: string[];
    fonts: string[];
    other: string[];
  };
}

interface AssetBrowserProps {
  provider: AssetProvider;
}

type AssetGroup = keyof AssetManifest["assets"];

const BASE = "https://iconarium.vercel.app/packages";

export default function AssetBrowser({ provider }: AssetBrowserProps) {
  const [manifest, setManifest] = useState<AssetManifest | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");

  const [group, setGroup] = useState<AssetGroup>("css");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setError(null);

        const response = await fetch(
          `/packages/${provider}/latest/assets.json`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        setManifest((await response.json()) as AssetManifest);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load asset manifest.",
        );
      }
    }

    void load();

    return () => {
      controller.abort();
    };
  }, [provider]);

  const files = useMemo(() => {
    if (!manifest) {
      return [];
    }

    const search = query.trim().toLowerCase();

    return manifest.assets[group].filter((file) =>
      file.toLowerCase().includes(search),
    );
  }, [manifest, group, query]);

  if (error) {
    return (
      <section>
        <div className="browser-error">
          <strong>Could not load assets.</strong>

          <code>{error}</code>
        </div>
      </section>
    );
  }

  if (!manifest) {
    return (
      <section>
        <p>Loading assets…</p>
      </section>
    );
  }

  return (
    <section className="asset-browser">
      <div className="asset-browser-toolbar">
        <div>
          <span className="section-kicker">Version</span>

          <h2>{manifest.version}</h2>
        </div>

        <input
          type="search"
          placeholder="Search files…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="asset-tabs">
        <AssetTab
          label="CSS"
          count={manifest.assets.css.length}
          active={group === "css"}
          onClick={() => setGroup("css")}
        />

        <AssetTab
          label="Fonts"
          count={manifest.assets.fonts.length}
          active={group === "fonts"}
          onClick={() => setGroup("fonts")}
        />

        <AssetTab
          label="Other"
          count={manifest.assets.other.length}
          active={group === "other"}
          onClick={() => setGroup("other")}
        />
      </div>

      <p className="result-count">
        Showing {files.length.toLocaleString()}{" "}
        {files.length === 1 ? "file" : "files"}
      </p>

      <div className="asset-file-list">
        {files.map((file) => (
          <AssetFile
            key={file}
            provider={provider}
            version={manifest.version}
            file={file}
            group={group}
          />
        ))}
      </div>

      {files.length === 0 && (
        <div className="empty-state">No matching files.</div>
      )}
    </section>
  );
}

function AssetTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={active ? "asset-tab active" : "asset-tab"}
      onClick={onClick}
    >
      {label}

      <span>{count}</span>
    </button>
  );
}

function AssetFile({
  provider,
  version,
  file,
  group,
}: {
  provider: AssetProvider;
  version: string;
  file: string;
  group: AssetGroup;
}) {
  const filename = file.split("/").at(-1) ?? file;

  const latest = `${BASE}/${provider}/latest/${file}`;

  const pinned = `${BASE}/${provider}/${version}/${file}`;

  return (
    <article className="asset-file">
      <div className="asset-file-heading">
        <div>
          <strong>{filename}</strong>

          <code>{file}</code>
        </div>

        <span className="asset-file-type">{group}</span>
      </div>

      <AssetUrl label="Latest" url={latest} stylesheet={group === "css"} />

      <AssetUrl label={version} url={pinned} stylesheet={group === "css"} />
    </article>
  );
}

function AssetUrl({
  label,
  url,
  stylesheet,
}: {
  label: string;
  url: string;
  stylesheet: boolean;
}) {
  return (
    <div className="asset-version">
      <span className="asset-version-label">{label}</span>

      <code className="asset-url-value">{url}</code>

      <div className="asset-copy-actions">
        <CopyButton label="URL" value={url} />

        {stylesheet && (
          <>
            <CopyButton
              label="<link>"
              value={`<link rel="stylesheet" href="${url}" />`}
            />

            <CopyButton label="@import" value={`@import url("${url}");`} />
          </>
        )}
      </div>
    </div>
  );
}

function CopyButton({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <button type="button" onClick={copy}>
      {copied ? "Copied!" : label}
    </button>
  );
}
