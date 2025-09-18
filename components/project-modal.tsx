"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

interface ProjectModalProps {
  isOpen: boolean
  projectId: number | null
  title?: string
  onClose: () => void
  onExited?: () => void
}

export default function ProjectModal({ isOpen, projectId, title, onClose, onExited }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const lastStableProjectRef = useRef<{ id: number | null; title?: string } | null>(null)

  // Lock scroll saat terbuka
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow
      const prevAttr = document.body.getAttribute("data-modal-open")
      document.body.style.overflow = "hidden"
      document.body.setAttribute("data-modal-open", "true")
      return () => {
        document.body.style.overflow = prevOverflow
        if (prevAttr === null) {
          document.body.removeAttribute("data-modal-open")
        } else {
          document.body.setAttribute("data-modal-open", prevAttr)
        }
      }
    }
  }, [isOpen])

  // Preserve displayed project during close animation
  useEffect(() => {
    if (isOpen) {
      lastStableProjectRef.current = { id: projectId, title }
    }
  }, [isOpen, projectId, title])

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

  // Notify when exit transition finishes
  useEffect(() => {
    if (!isOpen && onExited) {
      const timeout = setTimeout(() => {
        onExited()
        // Opsional: kosongkan ref agar tidak flash konten lama saat open berikutnya
        lastStableProjectRef.current = null
      }, 400) // match duration-400
      return () => clearTimeout(timeout)
    }
  }, [isOpen, onExited])

  const displayed = isOpen
    ? { id: projectId, title }
    : (lastStableProjectRef.current ?? { id: projectId, title })

  // Mapping judul project → daftar nama custom
  const projectNames: Record<string, string[]> = {
    "Portfolio & Personal Websites": ["Zaim El Yafi"],
    "Web Tools/Utilities": ["AI Image Enhancer", "Weather Web App", "SyncNotifier"],
    "Business/Company Websites": ["Wings Dimsum", "PPSA Suko Mulyo Tegal"],
    "Web Application (Full CRUD)": ["Taskflow"],
    // tambahin mapping lain kalau perlu, contoh:
    // "Portfolio & Personal Websites": ["Zaim El Yafi", "Nama Tambahan"],
  }

  // Mapping judul project → deskripsi spesifik per card (silakan ganti isinya)
  const projectDescriptions: Record<string, string> = {
    "Portfolio & Personal Websites": "Websites focused on personal branding and identity. From interactive portfolios to landing pages that highlight skills, projects, and achievements.",
    "Web Tools/Utilities": "A collection of lightweight web applications built to solve specific tasks and provide practical functionality.",
    "Business/Company Websites": "Professional websites designed for small businesses, brands, or organizations. These projects showcase company profiles, services, and products while strengthening their digital presence.",
    "Web Application (Full CRUD)": "Feature-rich applications with Create, Read, Update, and Delete functionalities. These projects demonstrate end-to-end development skills, from frontend and backend to database integration.",
    // Tambah/ubah deskripsi sesuai kebutuhan
  }

  return createPortal(
    <div className={`fixed inset-0 z-[100] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`} data-swipe-exempt="true">
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
        aria-label={displayed.id ? `Detail Project ${displayed.id}` : "Detail Project"}
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
                <h3 className="text-base sm:text-lg md:text-xl font-medium break-words whitespace-normal leading-snug">
                  {displayed.title ?? (displayed.id ? `Project ${displayed.id}` : "Project")}
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

              {/* Media menampilkan hanya daftar custom name (tanpa judul) */}
              <div className="w-full h-44 sm:h-56 md:h-64 mb-4 flex items-center justify-center">
                <h4 className="instrument text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-black/90 text-center">
                  {(() => {
                    const names = displayed.title ? projectNames[displayed.title] : undefined
                    if (names && names.length > 0) {
                      return (
                        <>
                          {names.map((name) => (
                            <span key={name} className="block">
                              {name}
                            </span>
                          ))}
                        </>
                      )
                    }
                    return null
                  })()}
                </h4>
              </div>

              {/* Deskripsi spesifik per card */}
              {(() => {
                const description = displayed.title ? projectDescriptions[displayed.title] : undefined
                if (!description) return null
                return (
                  <p className="text-sm text-black/70 mb-4 text-center">
                    {description}
                  </p>
                )
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
