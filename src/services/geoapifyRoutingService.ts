export type RouteMode = 'walk' | 'bicycle' | 'drive' | 'transit'

export interface LocationPoint {
  lat: number
  lng: number
  label: string
}

export interface RouteInfo {
  mode: RouteMode
  duration: number
  distance: number
  geometry: [number, number][]
  available: boolean
}

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY ?? '96d3fdfdd8e84bd6b3959f52012ac15e'

const MODE_LABELS: Record<RouteMode, string> = {
  walk: 'A pie',
  bicycle: 'Bicicleta',
  drive: 'Auto',
  transit: 'Transporte público',
}

export function getModeLabel(mode: RouteMode): string {
  return MODE_LABELS[mode]
}

export interface FetchRouteParams {
  origin: LocationPoint
  destination: LocationPoint
  mode: RouteMode
}

export async function fetchRoute({ origin, destination, mode }: FetchRouteParams): Promise<RouteInfo> {
  const waypoints = `${origin.lat},${origin.lng}|${destination.lat},${destination.lng}`
  const url = `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=${mode}&format=geojson&apiKey=${API_KEY}`

  const res = await fetch(url)

  if (!res.ok) {
    return { mode, duration: 0, distance: 0, geometry: [], available: false }
  }

  const data = await res.json()

  if (!data.features?.length) {
    return { mode, duration: 0, distance: 0, geometry: [], available: false }
  }

  const feature = data.features[0]
  const props = feature.properties
  const coordinates = feature.geometry.coordinates as [number, number][]

  const distance = props.distance?.value ?? 0
  const duration = props.time ?? 0

  return { mode, duration, distance, geometry: coordinates, available: true }
}
