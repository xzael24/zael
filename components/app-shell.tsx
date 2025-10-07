"use client"

import React, { useState, useCallback } from "react"
import dynamic from "next/dynamic"
import PreloaderSimple from "@/components/preloader-simple"
import { SwipeNavigationProvider } from "@/components/swipe-navigation"

// Dynamic import komponen non-kritis agar tidak membebani initial bundle
const CustomCursor = dynamic(() => import("@/components/custom-cursor"), { ssr: false })
const SwipeHint = dynamic(() => import("@/components/swipe-hint"), { ssr: false })

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false)

  const handlePreloaderComplete = useCallback(() => {
    setIsPreloaderDone(true)
  }, [])

  return (
    <SwipeNavigationProvider>
      <PreloaderSimple onComplete={handlePreloaderComplete}>
        {/* Render hanya setelah preloader usai agar tidak ikut menghambat paint awal */}
        {isPreloaderDone && <CustomCursor />}
        <SwipeHint />
        {children}
      </PreloaderSimple>
    </SwipeNavigationProvider>
  )
}


