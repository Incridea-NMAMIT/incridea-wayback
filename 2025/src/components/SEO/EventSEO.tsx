import Head from 'next/head';
import { useRouter } from 'next/router';

/**
 * Props interface for SEO component
 */
interface SEOProps {
    title?: string | null;           // Page title
    description?: string | null;     // Meta description
    image?: string | null;          // OG image URL
    url?: string | null;            // Canonical URL
}

/**
 * SEO Component
 * Handles all meta tags and SEO-related head elements
 * Provides default values for Capture Incridea website
 */

const EventSEO = ({
    title,
    description,
    image,
    url
}: SEOProps) => {
    const router = useRouter();
    const baseUrl = "https://2025.wayback.incridea.in";
    const canonicalUrl = url ?? `${baseUrl}${(router.asPath || "/").split("?")[0]}`;
    const archiveTitle = title?.includes("Archive") ? title : `${title ?? "Event"} | Incridea 2025 Archive`;
    const archiveDescription = description ?? "Revisit this event from the official Incridea 2025 archive at NMAM Institute of Technology, Nitte.";
    return (
        <Head>
            <title>{archiveTitle}</title>
            <meta name="description" content={archiveDescription} />
            <link rel="canonical" href={canonicalUrl} />
            {/* Open Graph */}
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={archiveTitle} />
            <meta property="og:description" content={archiveDescription} />
            <meta property="og:image" content={image ?? "/favicon/favicon-16x16.png"} />
        </Head>
    );
};

export default EventSEO;
