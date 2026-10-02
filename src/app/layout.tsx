import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import { person, seo, siteUrl } from "@/data/portfolio";
import "./globals.css";
import "./interactions.css";

/* Archivo carries the headings: a grotesque with real width and weight range,
   chosen over the geometric sans that fronts every other AI portfolio. */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: ["500", "600", "700"],
});

/* A serif for prose. Uncommon on an engineering portfolio, and it reads far
   better than a sans across the About and Experience paragraphs. */
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

/* Mono is reserved for machine vocabulary — dates, metrics, tech names. */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: person.name, url: siteUrl }],
  creator: person.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: seo.title,
    title: seo.title,
    description: seo.description,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${person.name} — ${person.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0e1420" },
    { media: "(prefers-color-scheme: light)", color: "#f2f4f7" },
  ],
};

/**
 * Applies the saved (or system) theme before first paint so there is no
 * light/dark flash on load. Kept tiny and inline on purpose.
 */
const themeScript = `(function(){try{var s=localStorage.getItem('theme');var t=s||(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

/** JSON-LD so search engines read the page as a person, not just text. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.title,
  description: seo.description,
  url: siteUrl,
  address: { "@type": "PostalPlace", name: person.location },
  knowsAbout: seo.keywords,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${archivo.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {/* Scroll-reveal starts at opacity 0 and is animated in by JS. Without
            JS that would leave the page blank, so force every revealed block
            visible for non-JS visitors and crawlers. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
