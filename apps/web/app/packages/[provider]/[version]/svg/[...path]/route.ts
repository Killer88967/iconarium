import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { NextRequest } from "next/server";

interface RouteContext {
  params: Promise<{
    provider: string;
    version: string;
    path: string[];
  }>;
}

const PROVIDERS = [
  "font-awesome",
  "devicons",
  "simple-icons",
  "octicons",
] as const;

type Provider = (typeof PROVIDERS)[number];

interface SimpleIconMetadata {
  hex: string;
}

interface SimpleIconsMetadata {
  icons: Record<string, SimpleIconMetadata>;
}

function isProvider(value: string): value is Provider {
  return PROVIDERS.includes(value as Provider);
}

function safeSegment(value: string) {
  return /^[a-zA-Z0-9._-]+$/.test(value);
}

function normalizeHex(value: string): string | null {
  const hex = value.replace(/^#/, "");

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    return null;
  }

  return `#${hex}`;
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

  if (provider === "octicons") {
    /*
     * Iconarium:
     * /svg/mark-github/24.svg
     *
     * Upstream:
     * /icons/mark-github-24.svg
     */
    if (path.length !== 2) {
      return null;
    }

    const [name, sizeFile] = path;

    const match = sizeFile.match(/^(\d+)\.svg$/i);

    if (!match) {
      return null;
    }

    const size = match[1];

    const ref = version === "latest" ? "main" : `v${version}`;

    return (
      "https://raw.githubusercontent.com/" +
      `primer/octicons/${ref}` +
      `/icons/${name}-${size}.svg`
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

async function getSimpleIconBrandColor(
  version: string,
  path: string[],
): Promise<string | null> {
  if (path.length !== 1) {
    return null;
  }

  const iconName = path[0].replace(/\.svg$/i, "");

  const metadataPath = join(
    process.cwd(),
    "public",
    "packages",
    "simple-icons",
    version,
    "metadata.json",
  );

  try {
    const raw = await readFile(metadataPath, "utf8");

    const metadata = JSON.parse(raw) as SimpleIconsMetadata;

    const icon = metadata.icons[iconName];

    if (!icon?.hex) {
      return null;
    }

    return normalizeHex(icon.hex);
  } catch {
    return null;
  }
}

function applySvgColor(svg: string, color: string, force = false) {
  let result = svg;

  /*
   * Replace currentColor references.
   */
  result = result.replace(/fill=(["'])currentColor\1/gi, `fill="${color}"`);

  result = result.replace(/color=(["'])currentColor\1/gi, `color="${color}"`);

  /*
   * If explicitly forcing a color, replace
   * literal fill values on child elements too.
   *
   * This is useful for Devicons where paths often
   * contain fill="#fff", fill="#000", etc.
   */
  if (force) {
    result = result.replace(
      /fill=(["'])(?!none\b)[^"']+\1/gi,
      `fill="${color}"`,
    );
  }

  /*
   * Set root fill + color as a fallback for
   * inherited monochrome SVGs.
   */
  result = result.replace(/<svg\b([^>]*)>/i, (_match, attributes: string) => {
    let updated = attributes;

    if (/\sfill\s*=/i.test(updated)) {
      updated = updated.replace(
        /\sfill\s*=\s*["'][^"']*["']/i,
        ` fill="${color}"`,
      );
    } else {
      updated += ` fill="${color}"`;
    }

    if (/\scolor\s*=/i.test(updated)) {
      updated = updated.replace(
        /\scolor\s*=\s*["'][^"']*["']/i,
        ` color="${color}"`,
      );
    } else {
      updated += ` color="${color}"`;
    }

    return `<svg${updated}>`;
  });

  return result;
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

  let svg = await response.text();

  const requestedColor = request.nextUrl.searchParams.get("color");

  if (requestedColor) {
    let color: string | null = null;

    if (requestedColor.toLowerCase() === "brand") {
      if (provider !== "simple-icons") {
        return new Response(
          'The "brand" color is only available for Simple Icons.',
          {
            status: 400,
          },
        );
      }

      color = await getSimpleIconBrandColor(version, path);

      if (!color) {
        return new Response("Brand color not found", {
          status: 404,
        });
      }
    } else {
      color = normalizeHex(requestedColor);

      if (!color) {
        return new Response(
          'Invalid color. Use "?color=brand" or a 6-digit hex value.',
          {
            status: 400,
          },
        );
      }
    }

    svg = applySvgColor(svg, color, provider === "devicons");
  }

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
