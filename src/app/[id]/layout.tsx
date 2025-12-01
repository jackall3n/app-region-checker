import type { Metadata } from "next";
import { lookupApp } from "~/lib/app-store";
import { AppJsonLd, BreadcrumbJsonLd } from "~/components/json-ld";

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  if (!id) {
    return {
      title: "Check App Availability",
      description:
        "Enter an App Store ID to check availability across all regions.",
    };
  }

  const data = await lookupApp(id, "us");
  const app = data?.results?.[0];

  if (!app) {
    return {
      title: `App ${id} - Region Availability`,
      description: `Check the availability of App Store app ${id} across 170+ countries and regions.`,
    };
  }

  const title = `${app.trackName} - Region Availability`;
  const description = `Check where "${app.trackName}" by ${app.artistName} is available on the App Store. See pricing in ${app.formattedPrice} (US) and availability across 170+ countries.`;

  return {
    title,
    description,
    keywords: [
      app.trackName,
      app.artistName,
      `${app.trackName} availability`,
      `${app.trackName} countries`,
      `${app.trackName} regions`,
      app.primaryGenreName,
      "App Store availability",
      "app region check",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: app.artworkUrl512,
          width: 512,
          height: 512,
          alt: `${app.trackName} app icon`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [app.artworkUrl512],
    },
    alternates: {
      canonical: `/${id}`,
    },
  };
}

const baseUrl = "https://appregionchecker.com";

export default async function AppLayout({ children, params }: Props) {
  const { id } = await params;
  const data = await lookupApp(id, "us");
  const app = data?.results?.[0];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: baseUrl },
          {
            name: app?.trackName ?? `App ${id}`,
            url: `${baseUrl}/${id}`,
          },
        ]}
      />
      {app && <AppJsonLd app={app} pageUrl={`${baseUrl}/${id}`} />}
      {children}
    </>
  );
}
