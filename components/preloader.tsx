"use client"

import { useEffect, useState, Suspense, lazy } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Lazy load shader components (same as home)
const MeshGradient = lazy(() => import("@paper-design/shaders-react").then(module => ({ default: module.MeshGradient })))

interface PreloaderProps {
  onComplete?: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Same gradient colors as home (shader-background-stable default)
  const gradientColors = ["#000000", "#1d4ed8", "#3b82f6", "#93c5fd", "#312e81"]

  useEffect(() => {
    // Preload shader component
    const preloadShaders = async () => {
      try {
        await import("@paper-design/shaders-react")
        setIsLoaded(true)
      } catch (error) {
        console.warn('Failed to load shaders:', error)
        setIsLoaded(true)
      }
    }
    preloadShaders()

    // Simulasi loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsComplete(true)
          // Delay sebelum hide preloader
          setTimeout(() => {
            onComplete?.()
          }, 500)
          return 100
        }
        return prev + Math.random() * 15 + 5 // Random increment untuk natural feel
      })
    }, 100)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
            transition: { duration: 0.5, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          {/* Background shader same as home (no bottom darkening overlay) */}
          <div className="absolute inset-0 w-full h-full">
            {isLoaded ? (
              <Suspense fallback={
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-indigo-700 to-black" />
              }>
                <MeshGradient
                  className="absolute inset-0 w-full h-full"
                  colors={gradientColors}
                  speed={0.3}
                />
              </Suspense>
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-indigo-700 to-black" />
            )}
          </div>
          
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center space-y-8">
            {/* Logo/Icon animasi */}
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
              {/* Pulsing circle background */}
              <motion.div
                className="w-24 h-24 rounded-full border-2 border-white/20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.svg
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17" />
                  <path d="M2 12L12 17L22 12" />
                </motion.svg>
              </div>
            </motion.div>

            {/* Loading text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl font-light text-white mb-2">
                Loading Experience
              </h2>
              <p className="text-sm text-white/60">
                Preparing your shader journey...
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
                transition={{ duration: 0.1 }}
              />
            </motion.div>

            {/* Progress percentage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-white/80 text-sm font-mono"
            >
              {Math.round(progress)}%
            </motion.div>

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex space-x-1"
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-white/60 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
