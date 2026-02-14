import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "DormApp — Smart Expense Splitting for Roommates",
    template: "%s | DormApp",
  },
  description:
    "The easiest way for roommates and dorm residents to track shared expenses, split bills fairly, and settle debts instantly. Free forever.",
  keywords: [
    "expense splitting app",
    "roommate expense tracker",
    "split bills app",
    "dorm expense tracker",
    "shared expenses app",
    "splitwise alternative",
    "roommate bill splitter",
    "Bangladesh expense tracker",
  ],
  authors: [{ name: "DormApp" }],
  creator: "DormApp",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "DormApp — Smart Expense Splitting for Roommates",
    description:
      "Track shared expenses, split bills fairly, and settle debts instantly with your roommates.",
    siteName: "DormApp",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DormApp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DormApp — Smart Expense Splitting for Roommates",
    description: "Track shared expenses, split bills fairly, and settle debts.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-512x512.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            richColors
            position="top-right"
            toastOptions={{ duration: 4000 }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}