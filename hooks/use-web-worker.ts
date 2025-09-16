import { useEffect, useRef, useCallback } from 'react'

interface WorkerMessage {
  type: string
  data?: any
}

interface WorkerResponse {
  type: string
  result?: any
  timestamp?: number
}

export function useWebWorker(workerPath: string) {
  const workerRef = useRef<Worker | null>(null)
  const messageHandlers = useRef<Map<string, (data: any) => void>>(new Map())

  useEffect(() => {
    // Initialize worker
    if (typeof Worker !== 'undefined') {
      workerRef.current = new Worker(workerPath)
      
      workerRef.current.onmessage = (e: MessageEvent<WorkerResponse>) => {
        const { type, result } = e.data
        const handler = messageHandlers.current.get(type)
        if (handler) {
          handler(result)
        }
      }

      workerRef.current.onerror = (error) => {
        console.error('Web Worker error:', error)
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [workerPath])

  const postMessage = useCallback((message: WorkerMessage) => {
    if (workerRef.current) {
      workerRef.current.postMessage(message)
    }
  }, [])

  const onMessage = useCallback((type: string, handler: (data: any) => void) => {
    messageHandlers.current.set(type, handler)
    
    return () => {
      messageHandlers.current.delete(type)
    }
  }, [])

  const isSupported = typeof Worker !== 'undefined'

  return {
    postMessage,
    onMessage,
    isSupported,
    isReady: !!workerRef.current
  }
}
