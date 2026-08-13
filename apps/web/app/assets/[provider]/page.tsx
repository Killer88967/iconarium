import { notFound } from "next/navigation";
import AssetBrowser from "./asset-browser";

const providers = {
  "font-awesome": {
    name: "Font Awesome",
    providerPage: "/providers/font-awesome",
  },

  devicons: {
    name: "Devicons",
    providerPage: "/providers/devicons",
  },

  "simple-icons-font": {
    name: "Simple Icons Font",
    providerPage: "/providers/simple-icons",
  },
} as const;

type AssetProvider = keyof typeof providers;

interface PageProps {
  params: Promise<{
    provider: string;
  }>;
}

export function generateStaticParams() {
  return Object.keys(providers).map((provider) => ({
    provider,
  }));
}

export default async function AssetPage({ params }: PageProps) {
  const { provider } = await params;

  if (!(provider in providers)) {
    notFound();
  }

  const providerName = provider as AssetProvider;

  const info = providers[providerName];

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

      <AssetBrowser provider={providerName} />
    </main>
  );
}
