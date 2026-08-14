import { notFound } from "next/navigation";
import { getProvider, isProviderId } from "@/lib/providers";
import Octicon from "@/components/octicon";
import IconDetails from "./icon-details";

interface PageProps {
  params: Promise<{
    provider: string;
    icon: string;
  }>;
}

export default async function IconPage({ params }: PageProps) {
  const { provider, icon } = await params;

  if (!isProviderId(provider)) {
    notFound();
  }

  const info = getProvider(provider);

  if (!info) {
    notFound();
  }

  return (
    <main>
      <section className="icon-page-hero">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/" aria-label="Home">
            <Octicon name="home" size={16} />
          </a>

          <Octicon name="chevron-right" size={16} />

          <a href={`/providers/${provider}`}>{info.name}</a>

          <Octicon name="chevron-right" size={16} />

          <span>{icon}</span>
        </nav>

        <div className="icon-page-heading">
          <div>
            <span className="section-kicker">Icon</span>
            <h1 className="icon-page-title">{icon}</h1>
          </div>

          <a className="ui-button" href={`/providers/${provider}`}>
            <Octicon name="arrow-left" size={16} />
            <span>Back to {info.name}</span>
          </a>
        </div>
      </section>

      <IconDetails provider={provider} iconName={icon} />
    </main>
  );
}
