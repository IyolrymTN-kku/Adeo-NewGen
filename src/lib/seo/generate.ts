import type { Metadata } from "next";
import { SEO_MAP } from "./seo.map";
import { getSEOConfig } from "./get-seo-config";

export async function generateSEOMetadata(
  path: string
): Promise<Metadata> {
  const SEO_CONFIG = await getSEOConfig();

  const page = SEO_MAP[path as keyof typeof SEO_MAP];

    const title = page?.title ?? SEO_CONFIG.defaultTitle;

  const description =
    page?.description ?? SEO_CONFIG.defaultDescription;

  return {
    metadataBase: new URL(SEO_CONFIG.siteUrl),

    title,
    description,

    openGraph: {
      title,
      description,
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: SEO_CONFIG.defaultImage,
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SEO_CONFIG.defaultImage],
    },
  };
}