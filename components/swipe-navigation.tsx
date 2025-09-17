"use client"

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface SwipeNavigationContextType {
  currentPage: number
  totalPages: number
  navigateToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  isTransitioning: boolean
}

const SwipeNavigationContext = createContext<SwipeNavigationContextType | undefined>(undefined)

export const useSwipeNavigation = () => {
  const context = useContext(SwipeNavigationContext)
  if (!context) {
    throw new Error("useSwipeNavigation must be used within SwipeNavigationProvider")
  }
  return context
}

interface SwipeNavigationProviderProps {
  children: ReactNode
}

const pages = [
  { id: "home" },
  { id: "about" },
  { id: "projects" },
  { id: "contact" },
]

export function SwipeNavigationProvider({ children }: SwipeNavigationProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentPage, setCurrentPage] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Ignore pathname; we use in-app state only
  useEffect(() => {
    setCurrentPage(prev => prev)
  }, [])

  // Initialize current page
  useEffect(() => {
    if (!isInitialized) {
      setCurrentPage(0)
      setIsInitialized(true)
    }
  }, [isInitialized])

  const navigateToPage = (pageIndex: number) => {
    if (pageIndex < 0 || pageIndex >= pages.length || isTransitioning) return
    
    setIsTransitioning(true)
    
    // Use double RAF for smoother state update
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setCurrentPage(pageIndex)
      })
    })
    
    // Reset transition state after animation
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300) // Reduced from 500ms for snappier response
  }

  const nextPage = () => {
    const next = (currentPage + 1) % pages.length
    navigateToPage(next)
  }

  const prevPage = () => {
    const prev = currentPage === 0 ? pages.length - 1 : currentPage - 1
    navigateToPage(prev)
  }

  // Touch handlers for mobile
  const isEventFromExemptArea = (target: EventTarget | null) => {
    if (!(target instanceof Node)) return false
    return !!(target as Element).closest('[data-swipe-exempt="true"]')
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isEventFromExemptArea(e.target)) {
      setTouchStart(null)
      setTouchEnd(null)
      return
    }
    // Prevent multiple touches
    if (e.targetTouches.length > 1) return
    
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isEventFromExemptArea(e.target)) return
    if (touchStart === null) return
    if (e.targetTouches.length > 1) return
    
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e?: React.TouchEvent) => {
    if (e && isEventFromExemptArea(e.target)) {
      setTouchStart(null)
      setTouchEnd(null)
      return
    }
    if (!touchStart || !touchEnd) {
      setTouchStart(null)
      setTouchEnd(null)
      return
    }
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    // Reset touch state immediately to prevent double triggers
    setTouchStart(null)
    setTouchEnd(null)

    if (isLeftSwipe) {
      nextPage()
    } else if (isRightSwipe) {
      prevPage()
    }
  }

  // Mouse handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEventFromExemptArea(e.target)) {
      setTouchStart(null)
      setTouchEnd(null)
      return
    }
    setTouchEnd(null)
    setTouchStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isEventFromExemptArea(e.target)) return
    if (touchStart !== null) {
      setTouchEnd(e.clientX)
    }
  }

  const handleMouseUp = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextPage()
    }
    if (isRightSwipe) {
      prevPage()
    }
    
    setTouchStart(null)
    setTouchEnd(null)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevPage()
      } else if (e.key === "ArrowRight") {
        nextPage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentPage, isTransitioning])

  const contextValue: SwipeNavigationContextType = {
    currentPage,
    totalPages: pages.length,
    navigateToPage,
    nextPage,
    prevPage,
    isTransitioning,
  }

  return (
    <SwipeNavigationContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setTouchStart(null)
          setTouchEnd(null)
        }}
      >
        {children}
      </div>
    </SwipeNavigationContext.Provider>
  )
}
