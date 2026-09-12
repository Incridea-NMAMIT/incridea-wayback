import Head from 'next/head';

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


    console.log(title, description, image, url)
    return (
        <Head>
            <title>{title}</title>
            {/* Open Graph */}
            <meta property="og:url" content={url ?? "https://incridea.in"} />
            <meta property="og:title" content={title ?? "Incridea | Techno-Cultural Fest of NMAM Institute of Technology"} />
            <meta property="og:description" content={description ?? " National level techno-cultural fest, NMAMIT, Nitte. Innovate. Create. Ideate."} />
            <meta property="og:image" content={image ?? "/favicon/favicon-16x16.png"} />
        </Head>
    );
};

export default EventSEO;
