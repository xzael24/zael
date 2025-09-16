"use client"

import Image from "next/image"
import { useState } from "react"

interface LogoProps {
  className?: string
  width?: number
  height?: number
  priority?: boolean
}

export default function Logo({ 
  className = "", 
  width = 64, 
  height = 64,
  priority = false 
}: LogoProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo1.svg"
        alt="Logo"
        width={width}
        height={height}
        priority={priority}
        style={{ width: 'auto', height: 'auto' }}
        className={`transition-opacity duration-300 h-16 w-16 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          console.warn('Failed to load logo, using fallback')
          setIsLoaded(true)
        }}
      />
      
      {/* Fallback logo saat loading */}
      {!isLoaded && (
        <div className="absolute flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg animate-pulse" />
        </div>
      )}
    </div>
  )
}
