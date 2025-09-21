"use client"

import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

export default function AboutContent() {
  const isMobile = useIsMobile()
  const [isDownloading, setIsDownloading] = useState(false)

  const fullDescription = "I’m Zael, a frontend developer with experience building landing pages, dashboards, and web tools. I specialize in crafting clean, responsive, and scalable interfaces using React, Next.js, and Tailwind, while also experimenting with animations and UI/UX details to create smooth and engaging user experiences. My journey in web development has allowed me to explore both the technical and creative sides of frontend, giving me the skills to bring ideas to life and continuously refine how users interact with digital products."

  const shortDescription = "I'm Zael, a frontend developer focusing on clean, responsive, and scalable interfaces using React and Next.js, with a touch of animation and UI/UX details."

  const description = isMobile ? shortDescription : fullDescription

  const handleDownload = async () => {
    setIsDownloading(true)
    
    try {
      // Simulasi delay untuk menunjukkan loading state
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Trigger download
      const link = document.createElement('a')
      link.href = '/CV_ZaimElYafi.pdf'
      link.download = 'CV_ZaimElYafi.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <main className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-5xl px-4">
      <div className="text-center">

        <h1 className="text-5xl md:text-6xl md:leading-16 tracking-tight font-light text-white mb-4">
          <span className="font-medium italic instrument">This</span> Is Me
        </h1>

        <p className="text-xs font-light text-white/70 mb-4 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`px-8 py-3 rounded-full bg-transparent border border-white/30 text-white font-normal text-xs transition-all duration-200 flex items-center gap-2 ${
              isDownloading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-white/10 hover:border-white/50 cursor-pointer'
            }`}
          >
            {isDownloading && (
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isDownloading ? 'Downloading...' : 'Download CV'}
          </button>
        </div>
      </div>
    </main>
  )
}
