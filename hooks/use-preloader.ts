import { useState, useEffect } from 'react'

interface PreloaderState {
  isLoading: boolean
  progress: number
  isComplete: boolean
}

export function usePreloader() {
  const [state, setState] = useState<PreloaderState>({
    isLoading: true,
    progress: 0,
    isComplete: false
  })

  useEffect(() => {
    // Simulasi loading progress yang lebih realistis
    const progressInterval = setInterval(() => {
      setState(prev => {
        if (prev.progress >= 100) {
          clearInterval(progressInterval)
          return {
            ...prev,
            isComplete: true
          }
        }
        
        // Increment progress dengan variasi untuk natural feel
        const increment = Math.random() * 12 + 3
        const newProgress = Math.min(prev.progress + increment, 100)
        
        return {
          ...prev,
          progress: newProgress
        }
      })
    }, 80)

    // Cleanup
    return () => clearInterval(progressInterval)
  }, [])

  const completeLoading = () => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      isComplete: true
    }))
  }

  const resetPreloader = () => {
    setState({
      isLoading: true,
      progress: 0,
      isComplete: false
    })
  }

  return {
    ...state,
    completeLoading,
    resetPreloader
  }
}
