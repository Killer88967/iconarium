"use client";

import { useEffect, useState } from "react";

type Provider = "font-awesome" | "devicons" | "simple-icons";

interface ProviderInfo {
  version: string;
}

interface Metadata {
  providerInfo: ProviderInfo;
}

interface Asset {
  label: string;
  latest: string;
  pinned: string;
}

interface ProviderAssetsProps {
  provider: Provider;
}

const BASE = "https://iconarium.vercel.app/packages";

function getAssets(provider: Provider, version: string): Asset[] {
  if (provider === "font-awesome") {
    return [
      {
        label: "All CSS",
        latest: `${BASE}/font-awesome/latest/css/all.css`,
        pinned: `${BASE}/font-awesome/${version}/css/all.css`,
      },
      {
        label: "All CSS · Minified",
        latest: `${BASE}/font-awesome/latest/css/all.min.css`,
        pinned: `${BASE}/font-awesome/${version}/css/all.min.css`,
      },
    ];
  }

  if (provider === "devicons") {
    return [
      {
        label: "Devicon CSS",
        latest: `${BASE}/devicons/latest/devicon.css`,
        pinned: `${BASE}/devicons/${version}/devicon.css`,
      },
      {
        label: "Devicon CSS · Minified",
        latest: `${BASE}/devicons/latest/devicon.min.css`,
        pinned: `${BASE}/devicons/${version}/devicon.min.css`,
      },
    ];
  }

  return [
    {
      label: "Simple Icons Font CSS",
      latest: `${BASE}/simple-icons-font/latest/font/simple-icons.css`,
      pinned: "",
    },
    {
      label: "Simple Icons Font CSS · Minified",
      latest: `${BASE}/simple-icons-font/latest/font/simple-icons.min.css`,
      pinned: "",
    },
  ];
}

export default function ProviderAssets({ provider }: ProviderAssetsProps) {
  const [version, setVersion] = useState<string | null>(null);

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
          return;
        }

        const metadata = (await response.json()) as Metadata;

        setVersion(metadata.providerInfo.version);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Failed to load provider asset metadata:", error);
      }
    }

    void load();

    return () => {
      controller.abort();
    };
  }, [provider]);

  if (!version) {
    return null;
  }

  const assets = getAssets(provider, version);

  return (
    <section className="provider-assets">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Assets</span>

          <h2>Stylesheets</h2>
        </div>

        <p>
          Direct CDN-ready stylesheet URLs, including readable and minified
          builds.
        </p>
      </div>

      <div className="asset-list">
        {assets.map((asset) => (
          <AssetCard key={asset.label} asset={asset} />
        ))}
      </div>
    </section>
  );
}

function AssetCard({ asset }: { asset: Asset }) {
  return (
    <article className="asset-card">
      <h3>{asset.label}</h3>

      <AssetUrl label="Latest" value={asset.latest} />

      {asset.pinned && <AssetUrl label="Pinned" value={asset.pinned} />}
    </article>
  );
}

function AssetUrl({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <div className="asset-url">
      <div className="asset-url-heading">
        <span>{label}</span>

        <button type="button" onClick={copy}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <code>{value}</code>
    </div>
  );
}
