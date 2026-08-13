import type { NextRequest } from "next/server";

interface RouteContext {
  params: Promise<{
    provider: string;
    version: string;
    path: string[];
  }>;
}

const PROVIDERS = ["font-awesome", "devicons", "simple-icons"] as const;

type Provider = (typeof PROVIDERS)[number];

function isProvider(value: string): value is Provider {
  return PROVIDERS.includes(value as Provider);
}

function safeSegment(value: string) {
  return /^[a-zA-Z0-9._-]+$/.test(value);
}

function upstreamUrl(provider: Provider, version: string, path: string[]) {
  const packageVersion = version === "latest" ? "latest" : version;

  if (provider === "font-awesome") {
    /*
     * Iconarium:
     * /svg/brands/github.svg
     *
     * Upstream:
     * /svgs/brands/github.svg
     */
    if (path.length !== 2) {
      return null;
    }

    const [style, file] = path;

    return (
      "https://cdn.jsdelivr.net/npm/" +
      `@fortawesome/fontawesome-free@${packageVersion}` +
      `/svgs/${style}/${file}`
    );
  }

  if (provider === "devicons") {
    /*
     * Iconarium:
     * /svg/typescript/original.svg
     *
     * Upstream:
     * /icons/typescript/typescript-original.svg
     */
    if (path.length !== 2) {
      return null;
    }

    const [name, variantFile] = path;

    const variant = variantFile.replace(/\.svg$/i, "");

    return (
      "https://cdn.jsdelivr.net/npm/" +
      `devicon@${packageVersion}` +
      `/icons/${name}/${name}-${variant}.svg`
    );
  }

  /*
   * Iconarium:
   * /svg/github.svg
   *
   * Upstream:
   * /icons/github.svg
   */
  if (path.length !== 1) {
    return null;
  }

  return (
    "https://cdn.jsdelivr.net/npm/" +
    `simple-icons@${packageVersion}` +
    `/icons/${path[0]}`
  );
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { provider, version, path } = await context.params;

  if (!isProvider(provider)) {
    return new Response("Unknown provider", {
      status: 404,
    });
  }

  if (!safeSegment(version) || path.length === 0 || !path.every(safeSegment)) {
    return new Response("Invalid SVG path", {
      status: 400,
    });
  }

  const upstream = upstreamUrl(provider, version, path);

  if (!upstream) {
    return new Response("Invalid SVG path", {
      status: 404,
    });
  }

  const response = await fetch(upstream, {
    headers: {
      "User-Agent": "iconarium/0.1",
    },

    next: {
      revalidate: version === "latest" ? 300 : false,
    },
  });

  if (!response.ok) {
    return new Response("SVG not found", {
      status: response.status,
    });
  }

  const svg = await response.text();

  const headers = new Headers();

  headers.set("Content-Type", "image/svg+xml; charset=utf-8");

  headers.set("Access-Control-Allow-Origin", "*");

  headers.set("Cross-Origin-Resource-Policy", "cross-origin");

  if (version === "latest") {
    headers.set("Cache-Control", "public, max-age=300, s-maxage=300");
  } else {
    headers.set(
      "Cache-Control",
      "public, max-age=31536000, s-maxage=31536000, immutable",
    );
  }

  return new Response(svg, {
    status: 200,
    headers,
  });
}
