import type { MetadataRoute } from "next";

import { providerIds } from "@/lib/providers";

import { icons as fontAwesomeIcons } from "@iconarium/font-awesome";
import { icons as deviconIcons } from "@iconarium/devicons";
import { icons as simpleIcons } from "@iconarium/simple-icons";
import { icons as octiconIcons } from "@iconarium/octicons";
import { icons as iconariumIcons } from "@iconarium/iconarium";

const baseUrl = "https://iconarium.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/providers`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const providerPages: MetadataRoute.Sitemap = providerIds.map((provider) => ({
    url: `${baseUrl}/providers/${provider}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const fontAwesomePages: MetadataRoute.Sitemap = Object.values(
    fontAwesomeIcons,
  ).flatMap((style) =>
    Object.values(style).map((icon) => ({
      url: `${baseUrl}/providers/font-awesome/${encodeURIComponent(icon.name)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  const deviconPages: MetadataRoute.Sitemap = Object.values(deviconIcons).map(
    (icon) => ({
      url: `${baseUrl}/providers/devicons/${encodeURIComponent(icon.name)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  const simpleIconPages: MetadataRoute.Sitemap = Object.values(simpleIcons).map(
    (icon) => ({
      url: `${baseUrl}/providers/simple-icons/${encodeURIComponent(icon.name)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  const octiconPages: MetadataRoute.Sitemap = Object.values(octiconIcons).map(
    (icon) => ({
      url: `${baseUrl}/providers/octicons/${encodeURIComponent(icon.name)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  const iconariumPages: MetadataRoute.Sitemap = Object.values(
    iconariumIcons,
  ).map((icon) => ({
    url: `${baseUrl}/providers/iconarium/${encodeURIComponent(icon.name)}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...providerPages,
    ...fontAwesomePages,
    ...deviconPages,
    ...simpleIconPages,
    ...octiconPages,
    ...iconariumPages,
  ];
}
