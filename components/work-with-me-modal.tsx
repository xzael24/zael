"use client"

import { useEffect, useRef } from "react"

interface WorkWithMeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function WorkWithMeModal({ isOpen, onClose }: WorkWithMeModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.body.setAttribute("data-modal-open", "true")
    } else {
      document.body.style.overflow = ""
      document.body.removeAttribute("data-modal-open")
    }
    return () => {
      document.body.style.overflow = ""
      document.body.removeAttribute("data-modal-open")
    }
  }, [isOpen])

  // Close on Esc
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, onClose])

  // Blur focus when closing to avoid focused element inside aria-hidden subtree
  useEffect(() => {
    if (!isOpen && dialogRef.current) {
      const active = document.activeElement as HTMLElement | null
      if (active && dialogRef.current.contains(active)) {
        active.blur()
      }
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div data-swipe-exempt="true" className={`fixed inset-0 z-[100] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <div
        onClick={handleBackdropClick}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className={`absolute inset-x-0 mx-auto top-4 md:top-16 w-[96%] md:w-[92%] max-w-xl rounded-2xl bg-white text-black shadow-2xl overflow-hidden transition-[transform,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
        }`}
        style={{
          willChange: "transform, opacity",
        }}
      >
        {/* Reveal animation using clip-path */}
        <div className="reveal-container">
          <div className={`reveal-clip ${isOpen ? "reveal-clip--show" : ""} max-h-[85vh] md:max-h-[80vh] overflow-y-auto`}>
            <div className="p-4 md:p-8" style={{ paddingBottom: "max(env(safe-area-inset-bottom), 1rem)" }}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="text-lg md:text-xl font-medium">Work With Me</h3>
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

            <p className="text-sm text-black/70 mb-4">
            Interested in collaborating? Fill out the form below and I'll get back to you soon.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                onClose()
              }}
              className="grid grid-cols-1 gap-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-black/70 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                    className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div>
                  <label className="block text-xs text-black/70 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="youremail@gmail.com"
                    className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-black/70 mb-1">Company (optional)</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Company name"
                  className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <div>
                <label className="block text-xs text-black/70 mb-1">Types of Collaboration</label>
                <input
                  type="text"
                  name="engagement"
                  placeholder="e.g., Project Based, Retainer, Consultation, Other"
                  className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <div>
                <label className="block text-xs text-black/70 mb-1">Description</label>
                <textarea
                  name="message"
                  required
                  placeholder="Tell us about your project needs or ideas..."
                  rows={5}
                  className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 resize-y"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <span className="text-xs text-black/50">Response is usually within 24 hours.</span>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-black text-white text-xs font-medium hover:bg-black/90 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
