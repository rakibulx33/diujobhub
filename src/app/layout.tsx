import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "../index.css";
import { Providers } from "./providers";

const sansFont = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DIUJOBHUB",
  description: "Modern AI-assisted job hub for seekers, employers, and admins.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${sansFont.variable} ${displayFont.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
