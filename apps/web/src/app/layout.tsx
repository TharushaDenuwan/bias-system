import { Providers } from "@/modules/layouts/providers";
import "@repo/ui/globals.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { fontHeading, fontSans } from "../lib/fonts";

export const metadata: Metadata = {
  title: "Bloonsoo.com",
  description:
    "Welcome to Bloonsoo.com, your one-stop destination for all your travel needs. Explore, book, and enjoy your perfect getaway.",
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
