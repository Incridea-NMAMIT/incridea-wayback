import { useEffect } from "react";
import { archiveSiteUrl, archiveYear, isArchiveMode } from "../archive/archive";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEO = ({ title, description, image, url }: SEOProps) => {
  const editionLabel = archiveYear
    ? "Incridea " + archiveYear + " Archive"
    : "Incridea'26";
  const defaultTitle = editionLabel + " | Innovate, Create, Ideate";
  const defaultDescription =
    "Incridea'26 is the annual techno-cultural fest of NMAM Institute of Technology, Nitte. Join us for a celebration of innovation and creativity.";
  const defaultImage = "/Meta.png"; // Ensure this file exists in public/
  const siteUrl = isArchiveMode ? archiveSiteUrl : "https://incridea.in";

  useEffect(() => {
    // Update Title
    document.title = title.includes("Incridea")
      ? title
      : title + " | " + editionLabel;

    // Helper to set meta tags
    const setMetaTag = (
      name: string,
      content: string,
      isProperty: boolean = false,
    ) => {
      let element = document.querySelector(
        `meta[${isProperty ? "property" : "name"}="${name}"]`,
      );
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(isProperty ? "property" : "name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper to set link tags (canonical)
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };
    const finalTitle = title || defaultTitle;
    const finalDescription = description || defaultDescription;
    const finalImage = `${siteUrl}${defaultImage}`;
    const finalUrl = url
      ? url.startsWith("http")
        ? url
        : `${siteUrl}${url}`
      : window.location.href;

    // Standard Meta Tags
    setMetaTag("description", finalDescription);

    // Open Graph
    setMetaTag("og:title", finalTitle, true);
    setMetaTag("og:description", finalDescription, true);
    setMetaTag("og:image", finalImage, true);
    setMetaTag("og:url", finalUrl, true);
    setMetaTag("og:type", "website", true);
    setMetaTag("og:site_name", editionLabel, true);

    // Twitter Card
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", finalDescription);
    setMetaTag("twitter:image", finalImage);

    // Canonical
    setLinkTag("canonical", finalUrl);

    // Cleanup function?
    // In a SPA, we usually let the next page's SEO component overwrite these.
    // However, if unmounting and going to a page WITHOUT SEO component, tags might persist.
    // For now, we assume all pages will have SEO or acceptable defaults.
  }, [title, description, image, url]);

  return null;
};

export default SEO;
