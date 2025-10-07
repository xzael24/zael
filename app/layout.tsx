import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Instrument_Serif } from "next/font/google"
import "./globals.css"
import AppShell from "@/components/app-shell"
import { Toaster } from "@/components/toaster"

// Optimasi font loading dengan preload dan subset minimal
const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"], // Hanya weight yang digunakan
  variable: "--font-figtree",
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'arial'],
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"], // Hanya normal weight
  style: ["normal"], // Hapus italic untuk mengurangi size
  variable: "--font-instrument-serif",
  display: "swap",
  preload: false, // Lazy load karena tidak critical
  fallback: ['serif'],
})

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "Zael - Frontend Developer",
  description: "Portfolio of Zael, a frontend developer creating clean, responsive, and engaging web applications with modern tools and design.",
  generator: "Next.js",
  keywords: [
    "Zael",
    "Zaim El Yafi",
    "Frontend Developer",
    "Web Developer",
    "Portfolio",
    "React",
    "Next.js",
  ],
  authors: [{ name: "Zaim El Yafi", url: process.env.NEXT_PUBLIC_APP_URL || 'https://zael.vercel.app' }],
  creator: "Zaim El Yafi",
  publisher: "Zaim El Yafi",
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" }
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Zael - Frontend Developer",
    description: "Portfolio of Zael, a frontend developer creating clean, responsive, and engaging web applications with modern tools and design.",
    type: "website",
    images: [
      {
        url: "/logo1.svg",
        width: 500,
        height: 500,
        alt: "Zael Logo",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${figtree.style.fontFamily};
  --font-sans: ${figtree.variable};
  --font-mono: ${GeistMono.variable};
  --font-instrument-serif: ${instrumentSerif.variable};
}
        `}</style>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Zaim El Yafi",
          "alternateName": ["Zael", "Zael Frontend Developer"],
          "url": process.env.NEXT_PUBLIC_APP_URL || 'https://zael.vercel.app',
          "jobTitle": "Frontend Developer",
          "image": "/logo1.svg",
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Zael - Frontend Developer",
          "url": process.env.NEXT_PUBLIC_APP_URL || 'https://zael.vercel.app',
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": (process.env.NEXT_PUBLIC_APP_URL || 'https://zael.vercel.app') + "/?q={search_term_string}",
            },
            "query-input": "required name=search_term_string"
          }
        }) }} />
      </head>
      <body className={`${figtree.variable} ${instrumentSerif.variable}`}>
        <AppShell>
          {children}
        </AppShell>
        <Toaster />
      </body>
    </html>
  )
}
