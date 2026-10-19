import { Providers } from "@/modules/layouts/providers";
import "@repo/ui/globals.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { fontHeading, fontSans } from "../lib/fonts";

export const metadata: Metadata = {
  title: "MediaBias.LK — ML-Based Bias Analysis of Sri Lankan Television News",
  description:
    "An academic research platform providing real-time Sinhala NLP inference to detect political alignment and framing severity in Sri Lankan broadcast news. Developed as an IIT / UoW Final Year Project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bodyClassName = `${fontSans.variable} ${fontHeading.variable} font-sans antialiased`;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={bodyClassName}>
        <Providers>
          <Suspense>
            {children}
            <Toaster position="bottom-left" />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
