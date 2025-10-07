"use client"

interface HeroContentProps {
  onOpenWorkWithMe?: () => void
}

export default function HeroContent({ onOpenWorkWithMe }: HeroContentProps) {
  return (
    <main className="absolute bottom-6 left-1 translate-x-0 z-20 w-full max-w-md px-4 pr-8 md:pr-0 md:bottom-8 md:left-8 md:w-auto md:max-w-lg md:px-0">
      <div className="text-left">
        {/* Subtle on-page name for SEO, extremely low opacity, moved to top-right */}
        <span className="sr-only">Zaim El Yafi (Zael) - Frontend Developer</span>
        <div
          aria-hidden="true"
          className="pointer-events-none select-none text-white absolute top-2 right-3 z-10 text-[2.75vw] md:text-[1.25vw] font-normal tracking-tight"
          style={{ opacity: 0.02 }}
        >
          Zaim El Yafi
        </div>
        <div
          className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-3 md:mb-4 relative"
          style={{
            filter: "url(#glass-effect)",
          }}
        >
          <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
          <span className="text-white/90 text-xs font-light relative z-10">🎨 Frontend Developer</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl leading-tight md:text-6xl md:leading-16 tracking-tight font-light text-white mb-3 md:mb-4">
          <span className="font-medium italic instrument">Sleek</span> Frontend
          <br />
          <span className="font-light tracking-tight text-white">Design</span>
        </h1>

        {/* Description */}
        <p className="text-xs font-light text-white/70 mb-4 leading-relaxed max-w-sm mx-auto md:max-w-none md:mx-0">
        Design modern web interfaces with responsive layouts, smooth transitions, and interactive elements that captivate every user.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3 md:gap-4 flex-wrap justify-start">
          <button
            onClick={onOpenWorkWithMe}
            className="px-6 py-2 md:px-8 md:py-3 rounded-full bg-white text-black font-normal text-xs transition-all duration-200 hover:bg-white/90 cursor-pointer"
          >
            Work With Me
          </button>
        </div>
      </div>
    </main>
  )
}
