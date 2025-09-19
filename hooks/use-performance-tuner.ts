"use client"

import { useEffect, useMemo, useRef, useState } from "react"

export interface PerformanceTunerOptions {
  /** Maks DPR efektif agar GPU tidak kewalahan di browser selain Brave */
  maxDevicePixelRatio?: number
  /** Target FPS minimal; jika drop di bawah ini, turunkan kualitas */
  targetFps?: number
  /** Kecepatan animasi dasar; akan diskalakan turun jika FPS rendah */
  baseSpeed?: number
}

export interface PerformanceTunerState {
  effectiveDpr: number
  qualityScale: number
  animationSpeed: number
  avgFps: number
}

/**
 * Hook untuk menyeragamkan performa lintas browser:
 * - Clamp DPR (devicePixelRatio) agar tidak terlalu tinggi di Chrome/Firefox
 * - Ukur FPS rolling dan sesuaikan quality scale + speed animasi
 */
export function usePerformanceTuner(options?: PerformanceTunerOptions): PerformanceTunerState {
  const { maxDevicePixelRatio = 1.5, targetFps = 55, baseSpeed = 0.3 } = options || {}

  const [avgFps, setAvgFps] = useState<number>(60)
  const frameTimesRef = useRef<number[]>([])
  const lastTsRef = useRef<number | null>(null)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    let isActive = true

    const loop = (ts: number) => {
      if (!isActive) return
      if (lastTsRef.current != null) {
        const dt = Math.max(1, ts - lastTsRef.current)
        const fps = 1000 / dt
        const buf = frameTimesRef.current
        buf.push(fps)
        if (buf.length > 30) buf.shift()
        const avg = buf.reduce((a, b) => a + b, 0) / buf.length
        setAvgFps(avg)
      }
      lastTsRef.current = ts
      rafIdRef.current = requestAnimationFrame(loop)
    }

    rafIdRef.current = requestAnimationFrame(loop)
    return () => {
      isActive = false
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current)
    }
  }, [])

  const effectiveDpr = useMemo(() => {
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
    return Math.min(dpr, maxDevicePixelRatio)
  }, [maxDevicePixelRatio])

  const qualityScale = useMemo(() => {
    // Jika FPS jatuh di bawah target, turunkan kualitas proporsional sampai 0.6
    if (avgFps >= targetFps) return 1
    const ratio = Math.max(0.6, avgFps / targetFps)
    return Number(ratio.toFixed(2))
  }, [avgFps, targetFps])

  const animationSpeed = useMemo(() => {
    // Skala kecepatan animasi turun saat FPS rendah agar terasa mulus
    return Number((baseSpeed * qualityScale).toFixed(3))
  }, [baseSpeed, qualityScale])

  return { effectiveDpr, qualityScale, animationSpeed, avgFps }
}


