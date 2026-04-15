import type { Metadata } from "next";
import { Source_Serif_4, Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-body-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cabinet Registry — Browse & Install Cabinet Templates",
  description:
    "A public registry of Cabinet templates — portable, file-system native operating units for AI-powered business functions. Browse, explore, and install ready-made cabinets.",
  icons: {
    icon: "/cabinet-icon.png",
    apple: "/cabinet-icon.png",
  },
  openGraph: {
    title: "Cabinet Registry — Browse & Install Cabinet Templates",
    description:
      "Browse and install portable cabinet templates for AI-powered business operations.",
    type: "website",
    url: "https://cabinets.sh",
    images: [
      {
        url: "https://cabinets.sh/og.png",
        width: 1200,
        height: 630,
        alt: "Cabinet Registry — Browse & Install Cabinet Templates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cabinet Registry — Browse & Install Cabinet Templates",
    description:
      "Browse and install portable cabinet templates for AI-powered business operations.",
    images: ["https://cabinets.sh/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
