import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuickEPK - Create Your Electronic Press Kit",
  description: "Build a professional musician EPK with view analytics. Know when bookers view your press kit and what they engage with.",
  keywords: ["EPK", "electronic press kit", "musician", "artist", "booking", "press kit builder"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
