"use client"

import { useEffect, useState } from "react"
import Logo from "./logo"
import { useSwipeNavigation } from "./swipe-navigation"
import { usePathname } from "next/navigation"

export default function Header() {
  const { navigateToPage, currentPage, totalPages } = useSwipeNavigation()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const pages = [
    { id: "home", name: "Home" },
    { id: "about", name: "About" },
    { id: "projects", name: "Projects" },
    { id: "contact", name: "Contact" },
  ]

  return (
    <header className="relative z-20 grid grid-cols-[auto_1fr_auto] items-center p-4 md:p-6 w-full">
      {/* Logo */}
      <div className="justify-self-start">
        <Logo 
          priority={true}
          className="w-12 md:w-14 h-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex items-center space-x-2 overflow-x-auto whitespace-nowrap w-full md:w-auto justify-self-end md:justify-self-center min-w-0 col-start-3 md:col-start-2">
        {pages.map((page, index) => (
          <button
            key={page.id}
            onClick={() => navigateToPage(index)}
            className={`shrink-0 text-xs font-light px-2 py-1 md:px-3 md:py-2 rounded-full transition-all duration-200 ${
              isClient && index === currentPage
                ? "text-white bg-white/20"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            {page.name}
          </button>
        ))}
      </nav>

      {/* Page Indicator */}
      <div className="hidden sm:flex items-center space-x-1 justify-self-center md:justify-self-end col-start-2 md:col-start-3">
        {Array.from({ length: totalPages }, (_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              isClient && i === currentPage 
                ? "bg-white scale-125" 
                : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </header>
  )
}
