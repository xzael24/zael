"use client"

import { useEffect, useRef, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  name: string
  email: string
  company?: string
  engagement?: string
  message: string
}

interface WorkWithMeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function WorkWithMeModal({ isOpen, onClose }: WorkWithMeModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const isMobile = useIsMobile()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    engagement: "",
    message: ""
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid email address"
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your message has been sent successfully. I'll get back to you within 24 hours.",
        })
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          company: "",
          engagement: "",
          message: ""
        })
        setErrors({})
        
        // Close modal after success
        setTimeout(() => {
          onClose()
        }, 1000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }
      
    } catch (error) {
      console.error('Error sending email:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-black/70 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className={`w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-black/10'} bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10`}
                  />
                  {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name}</span>}
                </div>
                <div>
                  <label className="block text-xs text-black/70 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="youremail@gmail.com"
                    className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-black/10'} bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10`}
                  />
                  {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs text-black/70 mb-1">Company (optional)</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company name"
                  className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <div>
                <label className="block text-xs text-black/70 mb-1">Types of Collaboration</label>
                <input
                  type="text"
                  name="engagement"
                  value={formData.engagement}
                  onChange={(e) => setFormData({ ...formData, engagement: e.target.value })}
                  placeholder={isMobile ? "e.g., Project Based, Retainer, Other" : "e.g., Project Based, Retainer, Consultation, Other"}
                  className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <div>
                <label className="block text-xs text-black/70 mb-1">Description</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your project needs or ideas..."
                  rows={5}
                  className={`w-full rounded-lg border ${errors.message ? 'border-red-500' : 'border-black/10'} bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 resize-y`}
                />
                {errors.message && <span className="text-xs text-red-500 mt-1">{errors.message}</span>}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <span className="text-xs text-black/50">Response is usually within 24 hours.</span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-full bg-black text-white text-xs font-medium transition-colors flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/90'}`}
                >
                  {isSubmitting && (
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {isSubmitting ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>
      {/* Cool hint buat dismiss */}
<div
  className={`absolute inset-x-0 bottom-3 md:bottom-6 z-[101] flex justify-center transition-all duration-300 ease-out ${
    isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
  }`}
  aria-hidden="true"
>
  <span className="text-xs text-white/80 font-medium drop-shadow-lg animate-pulse">
    {isMobile ? "Tap anywhere outside to dismiss" : "Click anywhere outside to dismiss"}
  </span>
</div>
    </div>
  )
}
