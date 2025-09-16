import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduRace Platform - Gamified Learning Experience",
  description: "Transform your learning journey with EduRace - a revolutionary gamified e-learning platform featuring real-time competition, sequential courses, and rewarding achievements.",
  keywords: ["e-learning", "gamified learning", "online courses", "educational platform", "competitive learning"],
  authors: [{ name: "EduRace Team" }],
  creator: "EduRace Platform",
  publisher: "EduRace Platform",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://edurace.com",
    siteName: "EduRace Platform",
    title: "EduRace Platform - Gamified Learning Experience",
    description: "Transform your learning journey with EduRace - a revolutionary gamified e-learning platform",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EduRace Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduRace Platform - Gamified Learning Experience",
    description: "Transform your learning journey with EduRace - a revolutionary gamified e-learning platform",
    images: ["/og-image.jpg"],
    creator: "@edurace",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
