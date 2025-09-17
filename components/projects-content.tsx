"use client"

import { useState } from 'react'
import ProjectModal from './project-modal'

export default function ProjectsContent() {
  const [openProjectId, setOpenProjectId] = useState<number | null>(null)

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
          {[1, 2, 3, 4].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpenProjectId(i)}
              aria-label={`Lihat detail Project ${i}`}
              className="relative group overflow-hidden shrink-0 snap-start w-44 sm:w-56 md:w-64 p-4 rounded-xl border border-white/10 bg-white/5 lg:hover:bg-white/10 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <img
                src={`/preview${i}-min.svg`}
                alt={`Preview Project ${i}`}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 z-0"
              />
              <div className="relative z-10 transition-opacity duration-300 lg:group-hover:opacity-0">
                <div className="text-white text-sm font-medium mb-1">
                  Project {i}
                </div>
                <div className="text-white/60 text-xs leading-relaxed">
                  Description of the project {i}.
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <ProjectModal
        isOpen={openProjectId !== null}
        projectId={openProjectId}
        onClose={() => setOpenProjectId(null)}
      />
    </main>
  )
}