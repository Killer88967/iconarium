import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {
    externalDir: true,
  },

  async rewrites() {
    return [
      {
        source: "/packages/:provider/:version",
        destination: "/packages/:provider/:version/index.js",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/packages/:provider/:version",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },

      {
        source: "/packages/:provider/latest",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, s-maxage=300",
          },
        ],
      },

      {
        source: "/packages/:provider/:version((?!latest$).+)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, s-maxage=31536000, immutable",
          },
        ],
      },

      {
        source: "/packages/:provider/:version/index.js",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },

      {
        source: "/packages/:provider/:version/index.d.ts",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Content-Type",
            value: "application/typescript; charset=utf-8",
          },
        ],
      },

      {
        source: "/packages/:provider/latest/index.d.ts",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, s-maxage=300",
          },
        ],
      },
    ];
  },
};

export default config;
