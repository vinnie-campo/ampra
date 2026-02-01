import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ampra | Home Battery Installation Made Simple",
  description: "Power. Secured. Get Tesla Powerwall installed by certified experts. Protect your home from outages, lower your energy bills, and take control of your power.",
  keywords: ["Tesla Powerwall", "home battery", "solar battery", "backup power", "energy storage", "California", "PSPS", "power shutoff"],
  authors: [{ name: "Ampra Energy" }],
  openGraph: {
    title: "Ampra | Home Battery Installation Made Simple",
    description: "Power. Secured. Get Tesla Powerwall installed by certified experts.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ampra | Home Battery Installation Made Simple",
    description: "Power. Secured. Get Tesla Powerwall installed by certified experts.",
  },
  icons: {
    icon: "/brand/logomark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-slate-50 font-sans">
        {children}
      </body>
    </html>
  );
}
