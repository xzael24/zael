"use client"

import { Suspense, lazy } from "react"
import Header from "@/components/header"
import HeroContent from "@/components/hero-content"
import AboutContent from "@/components/about-content"
import { useSwipeNavigation } from "@/components/swipe-navigation"
import ProjectsContent from "@/components/projects-content"
import ContactContent from "@/components/contact-content"

// Lazy load komponen berat untuk optimasi
const ShaderBackground = lazy(() => import("@/components/shader-background-stable"))

// Loading fallback yang ringan
const ShaderFallback = () => (
  <div className="min-h-screen bg-black relative overflow-hidden">
    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-blue-900 to-black" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  </div>
)

export default function HomePage() {
  const { currentPage } = useSwipeNavigation()
  return (
    <Suspense fallback={<ShaderFallback />}>
      <ShaderBackground isAbout={currentPage === 1} isProjects={currentPage === 2} isContact={currentPage === 3}>
        <Header />
        {currentPage === 0 && <HeroContent />}
        {currentPage === 1 && <AboutContent />}
        {currentPage === 2 && <ProjectsContent />}
        {currentPage === 3 && <ContactContent />}
      </ShaderBackground>
    </Suspense>
  )
}
