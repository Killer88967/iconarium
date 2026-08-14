import { notFound } from "next/navigation";
import IconDetails from "./icon-details";
import { getProvider, isProviderId } from "@/lib/providers";

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
        <a className="back-link" href={`/providers/${provider}`}>
          ← {info.name}
        </a>

        <span className="section-kicker">Icon</span>

        <h1 className="icon-page-title">{icon}</h1>
      </section>

      <IconDetails provider={provider} iconName={icon} />
    </main>
  );
}
