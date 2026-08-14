import { notFound } from "next/navigation";
import AssetBrowser from "./asset-browser";
import { providers } from "@/lib/providers";

const assetProviders = {
  "font-awesome": {
    name: providers["font-awesome"].name,
    providerPage: `/providers/${providers["font-awesome"].id}`,
  },

  devicons: {
    name: providers.devicons.name,
    providerPage: `/providers/${providers.devicons.id}`,
  },

  "simple-icons-font": {
    name: "Simple Icons Font",
    providerPage: `/providers/${providers["simple-icons"].id}`,
  },
} as const;

type AssetProvider = keyof typeof assetProviders;

interface PageProps {
  params: Promise<{
    provider: string;
  }>;
}

function isAssetProvider(provider: string): provider is AssetProvider {
  return provider in assetProviders;
}

export function generateStaticParams() {
  return Object.keys(assetProviders).map((provider) => ({
    provider,
  }));
}

export default async function AssetPage({ params }: PageProps) {
  const { provider } = await params;

  if (!isAssetProvider(provider)) {
    notFound();
  }

  const info = assetProviders[provider];

  return (
    <main>
      <section className="assets-hero">
        <a className="back-link" href="/assets">
          ← All assets
        </a>

        <span className="section-kicker">CDN Assets</span>

        <h1 className="asset-page-title">{info.name}</h1>

        <p className="hero-copy">
          Mirrored package files served directly through Iconarium.
        </p>

        <a className="asset-provider-source-link" href={info.providerPage}>
          Browse icons →
        </a>
      </section>

      <AssetBrowser provider={provider} />
    </main>
  );
}
