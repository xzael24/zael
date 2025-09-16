"use client"

import { useState, useEffect } from "react"
import { useIsMobile } from "../hooks/use-mobile"
import { useSwipeNavigation } from "./swipe-navigation"

export default function SwipeHint() {
  const [isVisible, setIsVisible] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'left' | 'right' | 'both' | 'fade'>('idle')
  const { currentPage, totalPages } = useSwipeNavigation()
  const isMobile = useIsMobile()

  useEffect(() => {
    // Show hint after 1.5 seconds on first load
    const timer = setTimeout(() => {
      setIsVisible(true)
      startHintAnimation()
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const startHintAnimation = () => {
    // Animation sequence: left -> right -> both -> fade
    setAnimationPhase('left')
    
    setTimeout(() => setAnimationPhase('right'), 800)
    setTimeout(() => setAnimationPhase('both'), 1600)
    setTimeout(() => setAnimationPhase('fade'), 2800)
    setTimeout(() => setIsVisible(false), 3300)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Left Edge Hint */}
      <div 
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-40 pointer-events-none transition-all duration-700 ${
          animationPhase === 'left' || animationPhase === 'both' 
            ? 'opacity-100 translate-x-0' 
            : animationPhase === 'fade'
            ? 'opacity-0 -translate-x-4'
            : 'opacity-0 -translate-x-8'
        }`}
      >
        <div className="flex items-center">
          {/* Gradient edge */}
          <div className="w-1 h-24 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-r-full" />
          
          {/* Arrow indicator */}
          <div className={`ml-2 transition-transform duration-500 ${
            animationPhase === 'left' || animationPhase === 'both' ? 'animate-pulse' : ''
          }`}>
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
              <svg 
                className="w-4 h-4 text-white/60" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
            </div>
          </div>

          {/* Swipe trail dots */}
          <div className="ml-3 flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full bg-white/40 transition-all duration-300 ${
                  animationPhase === 'left' || animationPhase === 'both'
                    ? `animate-ping` 
                    : 'opacity-30'
                }`}
                style={{ 
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Edge Hint */}
      <div 
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 pointer-events-none transition-all duration-700 ${
          animationPhase === 'right' || animationPhase === 'both' 
            ? 'opacity-100 translate-x-0' 
            : animationPhase === 'fade'
            ? 'opacity-0 translate-x-4'
            : 'opacity-0 translate-x-8'
        }`}
      >
        <div className="flex items-center flex-row-reverse">
          {/* Gradient edge */}
          <div className="w-1 h-24 bg-gradient-to-l from-transparent via-white/40 to-transparent rounded-l-full" />
          
          {/* Arrow indicator */}
          <div className={`mr-2 transition-transform duration-500 ${
            animationPhase === 'right' || animationPhase === 'both' ? 'animate-pulse' : ''
          }`}>
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
              <svg 
                className="w-4 h-4 text-white/60" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </div>
          </div>

          {/* Swipe trail dots */}
          <div className="mr-3 flex space-x-1 flex-row-reverse">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full bg-white/40 transition-all duration-300 ${
                  animationPhase === 'right' || animationPhase === 'both'
                    ? `animate-ping` 
                    : 'opacity-30'
                }`}
                style={{ 
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      </div>


      {/* Keyboard hint for desktop users - bottom center */}
      {!isMobile && (
        <div 
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none transition-all duration-500 ${
            animationPhase === 'both' 
              ? 'opacity-100' 
              : 'opacity-0'
          }`}
        >
          <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10">
            <div className="text-white/50 text-xs flex items-center space-x-2">
              <span>←→</span>
              <span>Keyboard</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}