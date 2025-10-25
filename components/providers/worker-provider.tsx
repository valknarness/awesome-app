'use client'

import * as React from 'react'
import { toast } from 'sonner'

interface WorkerContextType {
  isUpdateAvailable: boolean
  currentVersion: string | null
  refreshData: () => void
}

const WorkerContext = React.createContext<WorkerContextType>({
  isUpdateAvailable: false,
  currentVersion: null,
  refreshData: () => {},
})

export function useWorker() {
  const context = React.useContext(WorkerContext)
  if (!context) {
    throw new Error('useWorker must be used within WorkerProvider')
  }
  return context
}

export function WorkerProvider({ children }: { children: React.ReactNode }) {
  const [isUpdateAvailable, setIsUpdateAvailable] = React.useState(false)
  const [currentVersion, setCurrentVersion] = React.useState<string | null>(null)
  const [worker, setWorker] = React.useState<ServiceWorker | null>(null)

  React.useEffect(() => {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers not supported')
      return
    }

    // Register service worker
    navigator.serviceWorker
      .register('/worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration)
        setWorker(registration.active)

        // Check for updates periodically
        const checkForUpdates = () => {
          registration.update()
        }

        // Check every 5 minutes
        const interval = setInterval(checkForUpdates, 5 * 60 * 1000)

        return () => clearInterval(interval)
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error)
      })

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data.type === 'UPDATE_AVAILABLE') {
        setIsUpdateAvailable(true)
        setCurrentVersion(event.data.version)

        // Show toast notification
        toast.info('New content available!', {
          description: 'A new version of the database is ready.',
          action: {
            label: 'Refresh',
            onClick: () => refreshData(),
          },
          duration: Infinity, // Keep toast until user dismisses or clicks
        })
      }
    })

    // Fetch initial version
    fetch('/api/db-version')
      .then((res) => res.json())
      .then((data) => {
        setCurrentVersion(data.version)
      })
      .catch((error) => {
        console.error('Failed to fetch database version:', error)
      })
  }, [])

  const refreshData = React.useCallback(() => {
    // Clear cache and reload
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name)
        })
      })
    }

    // Reload the page
    window.location.reload()
  }, [])

  const value = React.useMemo(
    () => ({
      isUpdateAvailable,
      currentVersion,
      refreshData,
    }),
    [isUpdateAvailable, currentVersion, refreshData]
  )

  return <WorkerContext.Provider value={value}>{children}</WorkerContext.Provider>
}
