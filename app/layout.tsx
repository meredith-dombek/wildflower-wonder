import type { Metadata, Viewport } from "next";
import { Andika, Caprasimo } from "next/font/google";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const display = Caprasimo({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = Andika({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: nature activities for ages 3–6`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { title: site.name, description: site.slogan, images: ["/art/share.png"], type: "website" },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#fbf3e2" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} data-scroll-behavior="smooth">
      <body>
        <a className="skip" href="#main">Skip to the page</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
