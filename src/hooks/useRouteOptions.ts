import { useState, useCallback } from 'react'
import { fetchRoute, type RouteMode, type LocationPoint, type RouteInfo } from '../services/geoapifyRoutingService'

const ALL_MODES: RouteMode[] = ['walk', 'bicycle', 'drive', 'transit']

export interface UseRouteOptionsReturn {
  routes: RouteInfo[]
  isLoading: boolean
  error: string | null
  selectedMode: RouteMode | null
  setSelectedMode: (mode: RouteMode | null) => void
  calculateRoutes: (origin: LocationPoint, destination: LocationPoint) => Promise<void>
  clearRoutes: () => void
}

export function useRouteOptions(): UseRouteOptionsReturn {
  const [routes, setRoutes] = useState<RouteInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedMode, setSelectedMode] = useState<RouteMode | null>(null)

  const calculateRoutes = useCallback(async (origin: LocationPoint, destination: LocationPoint) => {
    setIsLoading(true)
    setError(null)
    setSelectedMode(null)
    setRoutes([])

    try {
      const results = await Promise.allSettled(
        ALL_MODES.map(mode => fetchRoute({ origin, destination, mode })),
      )

      const parsed: RouteInfo[] = results.map((result, index) => {
        const mode = ALL_MODES[index]
        if (result.status === 'fulfilled') {
          return result.value
        }
        return { mode, duration: 0, distance: 0, geometry: [], available: false }
      })

      setRoutes(parsed)
    } catch {
      setError('No pudimos calcular la ruta. Inténtalo nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearRoutes = useCallback(() => {
    setRoutes([])
    setSelectedMode(null)
    setError(null)
  }, [])

  return { routes, isLoading, error, selectedMode, setSelectedMode, calculateRoutes, clearRoutes }
}
