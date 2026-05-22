import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Civic Report",
  description: "Report and track civic complaints in your area.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${newsreader.variable}`}>
        {children}
      </body>
    </html>
  );
}
