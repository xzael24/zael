"use client"

import { useState } from 'react'
import ProjectModal from './project-modal'

export default function ProjectsContent() {
  const [selectedProject, setSelectedProject] = useState<{ id: number; title: string } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-6xl px-4">
      <div className="text-center">

        <h1 className="text-4xl md:text-5xl tracking-tight font-light text-white mb-6">
          Featured <span className="font-medium italic instrument">Projects</span>
        </h1>

        <p className="text-xs font-light text-white/70 mb-4 leading-relaxed max-w-sm mx-auto">
        A selection of projects I’ve worked on, each one a mix of code, design, and problem-solving. These are the ones I’m most proud to share.
        </p>

        {/* Card container: scroll horizontal di mobile & tablet, center di desktop */}
        <div
          data-swipe-exempt="true"
          className="flex gap-3 md:gap-4 overflow-x-auto lg:overflow-visible whitespace-nowrap lg:whitespace-normal -mx-4 px-4 lg:mx-0 lg:px-0 justify-start lg:justify-center snap-x snap-mandatory"
        >
          {['Web Tools/Utilities', 'Portfolio & Personal Websites', 'Business/Company Websites', 'Web Application (Full CRUD)'].map((category, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setSelectedProject({ id: i + 1, title: category }); setIsModalOpen(true) }}
              aria-label={`View ${category} projects`}
              className="relative group overflow-hidden shrink-0 snap-start w-44 sm:w-56 md:w-64 p-4 rounded-xl border border-white/10 bg-white/5 lg:hover:bg-white/10 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              {/* Hover overlay text */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 z-0">
                <span className="text-white text-xs sm:text-sm font-medium">Click to see the project</span>
              </div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                {/* Default view - only category name */}
                <div className="text-white text-xs sm:text-sm font-medium mb-1 transition-opacity duration-300 break-words whitespace-normal leading-snug lg:group-hover:opacity-0">
                  {category}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        projectId={selectedProject?.id ?? null}
        title={selectedProject?.title}
        onClose={() => setIsModalOpen(false)}
        onExited={() => setSelectedProject(null)}
      />
    </main>
  )
}