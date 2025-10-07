"use client"

import { useEffect, useState, Suspense, lazy } from "react"
import { usePerformanceTuner } from "@/hooks/use-performance-tuner"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// Lazy load shader components (same as home)
const MeshGradient = lazy(() => import("@paper-design/shaders-react").then(module => ({ default: module.MeshGradient })))

interface PreloaderSimpleProps {
  children: React.ReactNode
  onComplete?: () => void
  duration?: number
}

export default function PreloaderSimple({ 
  children,
  onComplete, 
  duration = 2000 
}: PreloaderSimpleProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const { animationSpeed, qualityScale, effectiveDpr } = usePerformanceTuner({ baseSpeed: 0.3 })
  const [reducedMotion, setReducedMotion] = useState(false)

  // Same gradient colors as home default (shader-background-stable)
  const gradientColors = ["#000000", "#1d4ed8", "#3b82f6", "#93c5fd", "#312e81"]

  useEffect(() => {
    // Preload shader components saat idle agar tidak ganggu TTI
    const schedule = (cb: () => void) => {
      if (typeof (window as any).requestIdleCallback === 'function') {
        ;(window as any).requestIdleCallback(cb, { timeout: 1500 })
      } else {
        setTimeout(cb, 600)
      }
    }

    const preloadShaders = async () => {
      try {
        await import("@paper-design/shaders-react")
        setIsLoaded(true)
      } catch (error) {
        console.warn('Failed to load shaders:', error)
        setIsLoaded(true) // Fallback to basic rendering
      }
    }

    schedule(preloadShaders)
  }, [])

  useEffect(() => {
    const start = performance.now()
    let rafId: number

    const tick = (ts: number) => {
      const elapsed = ts - start
      const progressPercent = Math.min((elapsed / duration) * 100, 100)
      setProgress(progressPercent)

      if (progressPercent >= 100) {
        setIsComplete(true)
        setTimeout(() => { onComplete?.() }, 300)
      } else {
        rafId = requestAnimationFrame(tick)
      }
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [duration, onComplete])

  // Respect prefers-reduced-motion untuk mengurangi animasi berat
  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  return (
    <>
      <AnimatePresence>
        {!isComplete && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.8, ease: "easeInOut" }
            }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center"
        >
          {/* Background shader same as home (no bottom darkening overlay) */}
          <div className="absolute inset-0 w-full h-full bg-black">
            {/* SVG Filters - Simplified (sama dengan shader-background-stable) */}
            <svg className="absolute inset-0 w-0 h-0" aria-hidden="true">
              <defs>
                <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
                  <feTurbulence baseFrequency="0.01" numOctaves="1" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.2" />
                </filter>
              </defs>
            </svg>

            {/* Background Shaders - Lazy loaded same settings as home */}
            {isLoaded && (
              <Suspense fallback={
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-indigo-700 to-black" />
              }>
                <MeshGradient
                  className="absolute inset-0 w-full h-full"
                  colors={gradientColors}
                  speed={animationSpeed}
                  style={{ imageRendering: qualityScale < 1 ? 'pixelated' as any : undefined, willChange: 'transform, opacity' }}
                  data-effective-dpr={effectiveDpr}
                  data-quality-scale={qualityScale}
                />
              </Suspense>
            )}

            {/* Fallback gradient saat loading */}
            {!isLoaded && (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-indigo-700 to-black" />
            )}
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center space-y-6">
            {/* Logo dengan animasi */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut",
                type: "spring",
                stiffness: 200
              }}
              className="relative"
            >
              {/* Pulsing circle */}
              <motion.div
                className="w-20 h-20 rounded-full border-2 border-white/30"
                animate={{
                  scale: reducedMotion ? 1 : [1, 1.1, 1],
                  opacity: reducedMotion ? 1 : [0.6, 1, 0.6],
                }}
                transition={{
                  duration: reducedMotion ? 0 : 2,
                  repeat: reducedMotion ? 0 : Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center"
                  animate={{ rotate: reducedMotion ? 0 : 360 }}
                  transition={{ duration: 3, repeat: reducedMotion ? 0 : Infinity, ease: "linear" }}
                >
                  <motion.div
                    className="w-6 h-6"
                    animate={{ rotate: reducedMotion ? 0 : -360 }}
                    transition={{ duration: 1.5, repeat: reducedMotion ? 0 : Infinity, ease: "linear" }}
                  >
                    <Image src="/logo.svg" alt="Logo" width={24} height={24} priority />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Loading text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center"
            >
              
              <p className="text-sm text-blue-100">
                Loading for your better experience...
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-64 h-1 bg-white/10 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-white/80 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: reducedMotion ? 0 : 0.1 }}
              />
            </motion.div>

            {/* Progress percentage */}
              <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: reducedMotion ? 0 : 0.5 }}
              className="text-white/80 text-sm font-mono"
            >
              {Math.round(progress)}%
            </motion.div>

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: reducedMotion ? 0 : 0.5 }}
              className="flex space-x-1"
            >
              {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-white/80 rounded-full"
                    animate={{
                      scale: reducedMotion ? 1 : [1, 1.3, 1],
                      opacity: reducedMotion ? 1 : [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: reducedMotion ? 0 : 1,
                      repeat: reducedMotion ? 0 : Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    <div className={`${isComplete ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      {children}
    </div>
    </>
  )
}
