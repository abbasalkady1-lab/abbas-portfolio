import type { Metadata } from "next";
import "./globals.css";
import { getSEO, getProfile } from "@/lib/db";
import { GoogleAnalytics } from "@/components/google-analytics";
import { resolveGaMeasurementId } from "@/lib/analytics";
import {
  getSiteUrl,
  resolveBingSiteVerification,
  resolveGoogleSiteVerification,
} from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const profile = await getProfile();
  const siteUrl = getSiteUrl(seo.canonicalUrl);
  const googleVerification = resolveGoogleSiteVerification(
    seo.googleSiteVerification
  );
  const bingVerification = resolveBingSiteVerification(seo.bingSiteVerification);

  return {
    metadataBase: new URL(siteUrl),
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords,
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    publisher: profile.name,
    category: "technology",
    applicationName: `${profile.name} Portfolio`,
    openGraph: {
      type: "website",
      locale: "en_US",
      alternateLocale: ["ar_EG"],
      url: siteUrl,
      title: seo.metaTitle,
      description: seo.metaDescription,
      siteName: `${profile.name} | AI & Automation Portfolio`,
      images: [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: profile.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: [seo.ogImage],
    },
    alternates: {
      canonical: siteUrl,
      languages: {
        en: `${siteUrl}/?lang=en`,
        ar: `${siteUrl}/?lang=ar`,
        "x-default": siteUrl,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      ...(googleVerification ? { google: googleVerification } : {}),
      ...(bingVerification
        ? { other: { "msvalidate.01": bingVerification } }
        : {}),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();
  const seo = await getSEO();
  const siteUrl = getSiteUrl(seo.canonicalUrl);
  const googleVerification = resolveGoogleSiteVerification(
    seo.googleSiteVerification
  );

  // Structured Data / JSON-LD for Search Engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: profile.name,
        alternateName: profile.nameAr,
        jobTitle: profile.jobTitle,
        description: profile.shortBio,
        url: siteUrl,
        image: profile.avatarUrl,
        sameAs: [
          profile.github,
          profile.linkedin,
          profile.youtube,
          profile.telegram,
          profile.behance,
          profile.twitter,
        ].filter(Boolean),
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: profile.university,
        },
        knowsAbout: [
          "Artificial Intelligence",
          "Autonomous AI Agents",
          "n8n Workflow Automation",
          "Retrieval-Augmented Generation (RAG)",
          "Large Language Models (LLM)",
          "Google Gemini API",
          "Next.js Full-Stack Architecture",
          "Real-time Web Voice AI",
          "Computer Vision",
        ],
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#webpage`,
        url: siteUrl,
        name: `${profile.name} — AI Engineer & Intelligent Products Builder`,
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        mainEntity: {
          "@id": `${siteUrl}/#person`,
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/#runnova`,
        name: "Runnova",
        alternateName: "Runnova Enterprise Autonomous AI Platform",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, Cloud",
        author: {
          "@id": `${siteUrl}/#person`,
        },
        description:
          "Enterprise autonomous AI employee platform featuring 77+ production routes, multi-channel orchestration, sub-450ms real-time voice synthesis, and multi-tenant security.",
        url: "https://runnova.ai",
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: `${profile.name} Digital Ecosystem`,
        description: seo.metaDescription,
        inLanguage: ["en", "ar"],
        publisher: {
          "@id": `${siteUrl}/#person`,
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {googleVerification ? (
          <meta
            name="google-site-verification"
            content={googleVerification}
          />
        ) : null}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark")}}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#F8FAFC] text-slate-900 dark:bg-[#090A0F] dark:text-slate-100 antialiased overflow-x-hidden selection:bg-sky-500/20 selection:text-sky-700 dark:selection:text-sky-300">
        <GoogleAnalytics
          measurementId={resolveGaMeasurementId(seo.googleAnalyticsId)}
        />
        {children}
      </body>
    </html>
  );
}
