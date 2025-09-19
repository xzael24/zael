"use client"

import { useIsMobile } from "@/hooks/use-mobile"

export default function AboutContent() {
  const isMobile = useIsMobile()

  const fullDescription = "I’m Zael, a frontend developer with experience building landing pages, dashboards, and web tools. I specialize in crafting clean, responsive, and scalable interfaces using React, Next.js, and Tailwind, while also experimenting with animations and UI/UX details to create smooth and engaging user experiences. My journey in web development has allowed me to explore both the technical and creative sides of frontend, giving me the skills to bring ideas to life and continuously refine how users interact with digital products."

  const shortDescription = "I'm Zael, a frontend developer focusing on clean, responsive, and scalable interfaces using React and Next.js, with a touch of animation and UI/UX details."

  const description = isMobile ? shortDescription : fullDescription

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
          <a
            href="/CV_ZaimElYafi.pdf"
            download="CV_ZaimElYafi.pdf"
            className="px-8 py-3 rounded-full bg-transparent border border-white/30 text-white font-normal text-xs transition-all duration-200 hover:bg-white/10 hover:border-white/50 cursor-pointer"
          >
            Download CV
          </a>
        </div>
      </div>
    </main>
  )
}
