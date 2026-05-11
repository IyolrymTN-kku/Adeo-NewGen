import type { Metadata } from "next";
import { SEO_MAP } from "./seo.map";
import { getSEOConfig } from "./get-seo-config";
import { isValidOGImage } from "./image-type";

export async function generateSEOMetadata(
  path: string
): Promise<Metadata> {
  const SEO_CONFIG = await getSEOConfig();

  const page = SEO_MAP[path as keyof typeof SEO_MAP];

  const title =
    page?.title ?? SEO_CONFIG.defaultTitle;

  const description =
    page?.description ??
    SEO_CONFIG.defaultDescription;

  const ogImage = isValidOGImage(
    SEO_CONFIG.ogImageUrl
  )
    ? SEO_CONFIG.ogImageUrl!
    : "/og-image.jpg";

  return {
    metadataBase: new URL(
      SEO_CONFIG.siteUrl
    ),

    title,
    description,

    openGraph: {
      title,
      description,
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}