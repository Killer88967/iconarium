import { notFound } from "next/navigation";
import IconDetails from "./icon-details";

const providers = {
  "font-awesome": "Font Awesome",
  devicons: "Devicons",
  "simple-icons": "Simple Icons",
} as const;

type Provider = keyof typeof providers;

interface PageProps {
  params: Promise<{
    provider: string;
    icon: string;
  }>;
}

export default async function IconPage({ params }: PageProps) {
  const { provider, icon } = await params;

  if (!(provider in providers)) {
    notFound();
  }

  return (
    <main>
      <section className="icon-page-hero">
        <a className="back-link" href={`/providers/${provider}`}>
          ← {providers[provider as Provider]}
        </a>

        <span className="section-kicker">Icon</span>

        <h1 className="icon-page-title">{icon}</h1>
      </section>

      <IconDetails provider={provider as Provider} iconName={icon} />
    </main>
  );
}
