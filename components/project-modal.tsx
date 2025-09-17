"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

interface ProjectModalProps {
  isOpen: boolean
  projectId: number | null
  onClose: () => void
}

export default function ProjectModal({ isOpen, projectId, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)

  // Lock scroll saat terbuka
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = prev }
    }
  }, [isOpen])

  // Tutup dengan Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, onClose])

  // Blur fokus saat menutup
  useEffect(() => {
    if (!isOpen && dialogRef.current) {
      const active = document.activeElement as HTMLElement | null
      if (active && dialogRef.current.contains(active)) {
        active.blur()
      }
    }
  }, [isOpen])

  if (typeof window === "undefined") return null

  return createPortal(
    <div className={`fixed inset-0 z-[100] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <button
        aria-label="Tutup overlay"
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={projectId ? `Detail Project ${projectId}` : "Detail Project"}
        className={`absolute inset-x-0 mx-auto top-4 md:top-16 w-[96%] md:w-[92%] max-w-xl rounded-2xl bg-white text-black shadow-2xl overflow-hidden transition-[transform,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        {/* Reveal animation */}
        <div className="reveal-container">
          <div className={`reveal-clip ${isOpen ? "reveal-clip--show" : ""} max-h-[85vh] md:max-h-[80vh] overflow-y-auto`}>
            <div className="p-4 md:p-8" style={{ paddingBottom: "max(env(safe-area-inset-bottom), 1rem)" }}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-lg md:text-xl font-medium">
                  {projectId ? `Project ${projectId}` : "Project"}
                </h3>
                <button
                  aria-label="Close"
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-black/5 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Media */}
              {projectId !== null && (
                <img
                  src={`/preview${projectId}-min.svg`}
                  alt={`Preview Project ${projectId}`}
                  className="w-full h-56 md:h-64 object-cover rounded-xl border border-black/10 mb-4"
                />
              )}

              {/* Meta / tags */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[10px] px-2 py-1 rounded-full bg-black/5">Next.js</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-black/5">Tailwind</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-black/5">UI/UX</span>
              </div>

              {/* Description */}
              <p className="text-sm text-black/70 mb-4">
              A brief description of the project. Describe the challenges, solutions, and outcomes. Include technology highlights and your role.
              </p>

				{/* Actions */}
				<div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
					<span className="text-xs text-black/50">Created 2024 · Brief case study</span>
					<div className="flex w-full gap-2 sm:w-auto">
						<a
							href="#"
							className="flex-1 sm:flex-none w-full sm:w-auto text-center px-4 py-2 rounded-full bg-black text-white text-xs font-medium hover:bg-black/90 transition-colors"
						>
							Live Demo
						</a>
						<a
							href="#"
							className="flex-1 sm:flex-none w-full sm:w-auto text-center px-4 py-2 rounded-full bg-black/5 text-black text-xs font-medium hover:bg-black/10 transition-colors"
						>
							Repo
						</a>
					</div>
				</div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}


