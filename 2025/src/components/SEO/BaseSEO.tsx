import Head from 'next/head';
import { useRouter } from 'next/router';

/**
 * Props interface for SEO component
 */
interface SEOProps {
  title?: string;           // Page title
  description?: string;     // Meta description
  image?: string;          // OG image URL
  url?: string;            // Canonical URL
}

/**
 * SEO Component
 * Handles all meta tags and SEO-related head elements
 * Provides default values for Capture Incridea website
 */
const BaseSEO = ({
  title = "Incridea 2025 Archive | NMAMIT Festival",
  description = "Explore the official Incridea 2025 archive: events, teams, galleries, and festival memories from NMAM Institute of Technology, Nitte.",
  image = "/favicon/favicon-16x16.png",
  url
}: SEOProps) => {
  const router = useRouter();
  const baseUrl = "https://2025.wayback.incridea.in";
  const path = (router.asPath || "/").split("?")[0];
  const canonicalUrl = url ?? `${baseUrl}${path}`;
  const archiveTitle = title.includes("Archive") ? title : `${title} | Incridea 2025 Archive`;
  const noindex = /^\/(login|register|dashboard|profile|admin|quiz|checkout)/.test(path);
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{archiveTitle}</title>
      <meta name="description" content={description} />

      <meta name="keywords" content="incridea, incredia ,nmamit,capture incridea,nitte,college fest" />

      {/* Social Media Meta Tags */}
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={archiveTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={archiveTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Technical Meta Tags */}
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Favicon Configuration */}
      <link rel="icon" type="image/png" href="/favicon/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />

      {/* webmanifest */}
      <link rel="manifest" href="/favicon/site.webmanifest" />
    </Head>
  );
};

export default BaseSEO;
