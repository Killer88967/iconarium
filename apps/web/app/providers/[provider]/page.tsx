import { notFound } from "next/navigation";
import ProviderBrowser from "./provider-browser";
import Octicon from "@/components/octicon";
import CodeBlock from "@/components/code-block";
import { getProvider, isProviderId, providerIds } from "@/lib/providers";

interface PageProps {
  params: Promise<{
    provider: string;
  }>;
}

export function generateStaticParams() {
  return providerIds.map((provider) => ({
    provider,
  }));
}

export default async function ProviderPage({ params }: PageProps) {
  const { provider } = await params;

  if (!isProviderId(provider)) {
    notFound();
  }

  const info = getProvider(provider);

  if (!info) {
    notFound();
  }

  return (
    <main>
      <section className="provider-page-header">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/" aria-label="Home">
            <Octicon name="home" size={16} />
          </a>

          <Octicon name="chevron-right" size={16} />

          <span>Providers</span>

          <Octicon name="chevron-right" size={16} />

          <span>{info.name}</span>
        </nav>

        <div className="provider-page-heading">
          <div className="provider-page-copy">
            <span className="section-kicker">Provider</span>

            <h1>{info.name}</h1>

            <p>{info.description}</p>
          </div>

          <div className="provider-page-actions">
            <a
              className="ui-button"
              href={info.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Octicon name="link-external" size={16} />
              <span>Upstream</span>
            </a>

            {info.hasAssets && info.assetsProvider && (
              <a className="ui-button" href={`/assets/${info.assetsProvider}`}>
                <Octicon name="package" size={16} />
                <span>Assets</span>
              </a>
            )}
          </div>
        </div>

        <div className="provider-import-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Octicon name="code" size={16} />
              <span>Browser import</span>
            </div>

            <span className="panel-meta">latest</span>
          </div>

          <CodeBlock>
            {`import { getIcon } from "https://iconarium.vercel.app/packages/${provider}/latest";`}
          </CodeBlock>
        </div>
      </section>

      <ProviderBrowser provider={provider} />
    </main>
  );
}
