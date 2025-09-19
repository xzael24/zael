"use client"

import React, { useState, useCallback } from "react"
import PreloaderSimple from "@/components/preloader-simple"
import CustomCursor from "@/components/custom-cursor"
import { SwipeNavigationProvider } from "@/components/swipe-navigation"

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
        {isPreloaderDone && <CustomCursor />}
        {children}
      </PreloaderSimple>
    </SwipeNavigationProvider>
  )
}


