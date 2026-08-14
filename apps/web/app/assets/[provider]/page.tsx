import { notFound } from "next/navigation";
import { providers } from "@/lib/providers";
import Octicon from "@/components/octicon";
import AssetBrowser from "./asset-browser";

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

  octicons: {
    name: providers.octicons.name,
    providerPage: `/providers/${providers.octicons.id}`,
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
      <section className="asset-page-header">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/" aria-label="Home">
            <Octicon name="home" size={16} />
          </a>

          <Octicon name="chevron-right" size={16} />

          <a href="/assets">Assets</a>

          <Octicon name="chevron-right" size={16} />

          <span>{info.name}</span>
        </nav>

        <div className="asset-page-heading">
          <div>
            <span className="section-kicker">CDN Assets</span>
            <h1>{info.name}</h1>

            <p>Mirrored package files served directly through Iconarium.</p>
          </div>

          <a className="ui-button" href={info.providerPage}>
            <Octicon name="link-external" size={16} />
            <span>Browse icons</span>
          </a>
        </div>
      </section>

      <AssetBrowser provider={provider} />
    </main>
  );
}
