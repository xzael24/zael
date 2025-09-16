import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Instrument_Serif } from "next/font/google"
import "./globals.css"
import PreloaderSimple from "@/components/preloader-simple"
import CustomCursor from "@/components/custom-cursor"
import { SwipeNavigationProvider } from "@/components/swipe-navigation"
import SwipeHint from "@/components/swipe-hint"

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
      </head>
      <body className={`${figtree.variable} ${instrumentSerif.variable}`}>
        <CustomCursor />
        <SwipeNavigationProvider>
          <PreloaderSimple>
            {children}
            <SwipeHint />
          </PreloaderSimple>
        </SwipeNavigationProvider>
      </body>
    </html>
  )
}
