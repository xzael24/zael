"use client"

import type React from "react"
import { useEffect, useRef, useState, Suspense, lazy } from "react"

// Lazy load shader components
const MeshGradient = lazy(() => import("@paper-design/shaders-react").then(module => ({ default: module.MeshGradient })))

interface ShaderBackgroundProps {
  children: React.ReactNode
  isAbout?: boolean
  isProjects?: boolean
  isContact?: boolean
}

export default function ShaderBackground({ children, isAbout = false, isProjects = false, isContact = false }: ShaderBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Preload shader components
    const preloadShaders = async () => {
      try {
        await import("@paper-design/shaders-react")
        setIsLoaded(true)
      } catch (error) {
        console.warn('Failed to load shaders:', error)
        setIsLoaded(true) // Fallback to basic rendering
      }
    }
    
    preloadShaders()
  }, [])

  // Gunakan gradien kuning untuk halaman About, selain itu tetap biru
  const gradientColors = isAbout
    ? ["#000000", "#f59e0b", "#fbbf24", "#fde68a", "#b45309"]
    : isProjects
      // Warm green untuk Projects
      ? ["#000000", "#16a34a", "#22c55e", "#86efac", "#065f46"]
      : isContact
        // Warm red untuk Contact
        ? ["#000000", "#dc2626", "#ef4444", "#fca5a5", "#7f1d1d"]
        // Default: warm blue (lebih hangat, sedikit ke indigo)
        : ["#000000", "#1d4ed8", "#3b82f6", "#93c5fd", "#312e81"]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* SVG Filters - Simplified */}
      <svg className="absolute inset-0 w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.01" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.2" />
          </filter>
        </defs>
      </svg>

      {/* Background Shaders - Lazy loaded dengan setting tetap */}
      {isLoaded && (
        <Suspense fallback={
          isAbout
            ? <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-amber-500 to-black" />
            : isProjects
              ? <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-green-600 to-black" />
              : isContact
                ? <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-red-600 to-black" />
                : <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-indigo-700 to-black" />
        }>
          <MeshGradient
            className="absolute inset-0 w-full h-full"
            colors={gradientColors}
            speed={0.3}
          />
        </Suspense>
      )}

      {/* Fallback gradient saat loading */}
      {!isLoaded && (
        isAbout
          ? <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-amber-500 to-black" />
          : isProjects
            ? <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-green-600 to-black" />
            : isContact
              ? <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-red-600 to-black" />
              : <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-indigo-700 to-black" />
      )}

      {/* Bottom darkening overlay (smooth, blended) */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
        style={{
          mixBlendMode: 'multiply',
          backgroundImage:
            'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0) 100%),\n' +
            'radial-gradient(120% 60% at 50% 110%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 75%)',
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundSize: '100% 100%, 100% 100%',
          willChange: 'opacity, transform'
        }}
      />

      {children}
    </div>
  )
}
