import type { Metadata } from "next";
import "./globals.css";
import { getSEO, getProfile } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const profile = await getProfile();

  return {
    metadataBase: new URL(seo.canonicalUrl || "https://abbaselkady.dev"),
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords,
    authors: [{ name: profile.name, url: seo.canonicalUrl }],
    creator: profile.name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: seo.canonicalUrl,
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
      canonical: seo.canonicalUrl,
      languages: {
        en: `${seo.canonicalUrl}/?lang=en`,
        ar: `${seo.canonicalUrl}/?lang=ar`,
        "x-default": seo.canonicalUrl,
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
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();
  const seo = await getSEO();

  // Structured Data / JSON-LD for Search Engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${seo.canonicalUrl}/#person`,
        name: profile.name,
        alternateName: profile.nameAr,
        jobTitle: profile.jobTitle,
        description: profile.shortBio,
        url: seo.canonicalUrl,
        image: profile.avatarUrl,
        sameAs: [profile.github, profile.linkedin].filter(Boolean),
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
        "@id": `${seo.canonicalUrl}/#webpage`,
        url: seo.canonicalUrl,
        name: `${profile.name} — AI Engineer & Intelligent Products Builder`,
        isPartOf: {
          "@id": `${seo.canonicalUrl}/#website`,
        },
        mainEntity: {
          "@id": `${seo.canonicalUrl}/#person`,
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${seo.canonicalUrl}/#runnova`,
        name: "Runnova",
        alternateName: "Runnova Enterprise Autonomous AI Platform",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, Cloud",
        author: {
          "@id": `${seo.canonicalUrl}/#person`,
        },
        description:
          "Enterprise autonomous AI employee platform featuring 77+ production routes, multi-channel orchestration, sub-450ms real-time voice synthesis, and multi-tenant security.",
        url: "https://runnova.ai",
      },
      {
        "@type": "WebSite",
        "@id": `${seo.canonicalUrl}/#website`,
        url: seo.canonicalUrl,
        name: `${profile.name} Digital Ecosystem`,
        description: seo.metaDescription,
        publisher: {
          "@id": `${seo.canonicalUrl}/#person`,
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
        {children}
      </body>
    </html>
  );
}
