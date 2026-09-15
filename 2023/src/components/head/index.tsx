import Head from 'next/head';
import { useRouter } from 'next/router';

export default function HeadComponent({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const router = useRouter();
  const baseUrl = "https://2023.wayback.incridea.in";
  const path = (router.asPath || "/").split("?")[0];
  const url = `${baseUrl}${path}`;
  const archiveTitle = title === "Incridea" ? "Incridea 2023 Archive | NMAMIT Festival" : `${title} | Incridea 2023 Archive`;
  const archiveDescription = description.replace("Official Website of", "Official archive of");
  const noindex = /^\/(login|register|dashboard|profile|admin|quiz)/.test(path);
  return (
    <Head>
      <title>{archiveTitle}</title>
      <meta name="description" content={archiveDescription} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Incridea Wayback" />
      <meta property="og:title" content={archiveTitle} />
      <meta property="og:description" content={archiveDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${baseUrl}/logo.png`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={archiveTitle} />
      <meta name="twitter:description" content={archiveDescription} />
      <meta name="twitter:image" content={`${baseUrl}/logo.png`} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" type="image/png" href="/favicon/favicon.ico" />
      <link
        rel="icon"
        type="image/png"
        href="/favicon/favicon-16x16.png"
        sizes="16x16"
      />
      <link
        rel="icon"
        type="image/png"
        href="/favicon/favicon-32x32.png"
        sizes="32x32"
      />
      <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
      <link rel="manifest" href="/favicon/site.webmanifest" />
    </Head>
  );
}
