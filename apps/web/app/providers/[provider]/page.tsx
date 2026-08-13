import { notFound } from "next/navigation";
import ProviderBrowser from "./provider-browser";
import ProviderAssets from "./provider-assets";

const providers = {
  "font-awesome": {
    name: "Font Awesome",
    description: "Browse Font Awesome Free brand, solid, and regular icons.",
  },

  devicons: {
    name: "Devicons",
    description: "Browse development icons and all available variants.",
  },

  "simple-icons": {
    name: "Simple Icons",
    description: "Browse thousands of brand icons and their metadata.",
  },
} as const;

type ProviderName = keyof typeof providers;

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

export default async function ProviderPage({ params }: PageProps) {
  const { provider } = await params;

  if (!(provider in providers)) {
    notFound();
  }

  const providerName = provider as ProviderName;
  const info = providers[providerName];

  return (
    <main>
      <section className="provider-hero">
        <a className="back-link" href="/">
          ← Iconarium
        </a>

        <span className="section-kicker">Provider</span>

        <h1 className="provider-title">{info.name}</h1>

        <p className="provider-description">{info.description}</p>

        <pre className="provider-import">
          <code>
            {`import { getIcon } from "https://iconarium.vercel.app/packages/${provider}/latest";`}
          </code>
        </pre>
      </section>

      <ProviderAssets provider={providerName} />

      <ProviderBrowser provider={providerName} />
    </main>
  );
}
