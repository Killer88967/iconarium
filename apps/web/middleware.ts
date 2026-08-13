import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const match = request.nextUrl.pathname.match(
    /^\/packages\/([^/]+)\/([^/]+)$/,
  );

  if (!match) {
    return response;
  }

  const [, provider, version] = match;

  const typesUrl = new URL(
    `/packages/${provider}/${version}/index.d.ts`,
    request.url,
  );

  response.headers.set("X-TypeScript-Types", typesUrl.toString());

  return response;
}

export const config = {
  matcher: "/packages/:provider/:version",
};
