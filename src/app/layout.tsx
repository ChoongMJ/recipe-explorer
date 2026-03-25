import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import Navbar from "./components/Navbar";
import { ReactQueryProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recipe Explorer Lite",
  description: "A lightweight recipe browsing application",
};

const themeInitScript = `
  try {
    const savedTheme = window.localStorage.getItem("theme-mode");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  } catch (error) {
    document.documentElement.classList.remove("dark");
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <ReactQueryProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <footer className="border-t bg-background py-6 text-muted-foreground">
            <div className="container mx-auto px-4 text-center">
              <p className="font-medium text-foreground">
                Recipe Explorer Lite &copy; {new Date().getFullYear()}
              </p>
              <p className="mt-2 text-sm">Data provided by TheMealDB</p>
            </div>
          </footer>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
