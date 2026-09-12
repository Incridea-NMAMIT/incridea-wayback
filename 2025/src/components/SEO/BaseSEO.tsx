import Head from 'next/head';

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
  title = "Incridea'25 | Techno-Cultural Fest of NMAM Institute of Technology",
  description = " National level techno-cultural fest, NMAMIT, Nitte. Innovate. Create. Ideate.",
  image = "/favicon/favicon-16x16.png",
  url = "https://incridea.in"
}: SEOProps) => {
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta name="keywords" content="incridea, incredia ,nmamit,capture incridea,nitte,college fest" />

      {/* Social Media Meta Tags */}
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Technical Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />

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
