export interface NearbyPlace {
  id: string
  name: string
  address: string
  distance: number | null
  rating: number
  price: string
  tags: string[]
  image: string
  lat: number
  lng: number
}

interface GeoapifyPlaceFeature {
  properties: {
    place_id?: string
    name?: string
    formatted?: string
    address_line1?: string
    address_line2?: string
    distance?: number
    categories?: string[]
    lat?: number
    lon?: number
  }
  geometry?: {
    coordinates?: [number, number]
  }
}

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY
const DEFAULT_RADIUS_METERS = 10000
const DEFAULT_LIMIT = 3

const CATEGORY_LABELS: Record<string, string> = {
  tourism: 'Turismo',
  attraction: 'Atracción',
  sights: 'Cultura',
  entertainment: 'Ocio',
  leisure: 'Relax',
  museum: 'Museo',
  restaurant: 'Gastronomía',
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1518005020951-eccb494ad742?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
]

export interface FetchNearbyPlacesParams {
  lat: number
  lng: number
  radius?: number
  limit?: number
}

export async function fetchNearbyPlaces({
  lat,
  lng,
  radius = DEFAULT_RADIUS_METERS,
  limit = DEFAULT_LIMIT,
}: FetchNearbyPlacesParams): Promise<NearbyPlace[]> {
  if (!API_KEY) {
    throw new Error('Geoapify API key is not configured')
  }

  const params = new URLSearchParams({
    categories: 'tourism.sights,tourism.attraction,entertainment,leisure',
    filter: `circle:${lng},${lat},${radius}`,
    bias: `proximity:${lng},${lat}`,
    limit: String(limit),
    apiKey: API_KEY,
  })

  const res = await fetch(`https://api.geoapify.com/v2/places?${params.toString()}`)

  if (!res.ok) {
    throw new Error('Geoapify Places request failed')
  }

  const data = await res.json()
  const features = (data.features ?? []) as GeoapifyPlaceFeature[]

  return features
    .map((feature, index) => mapFeatureToPlace(feature, index))
    .filter((place): place is NearbyPlace => place !== null)
}

function mapFeatureToPlace(feature: GeoapifyPlaceFeature, index: number): NearbyPlace | null {
  const props = feature.properties
  const [geometryLng, geometryLat] = feature.geometry?.coordinates ?? []
  const lat = props.lat ?? geometryLat
  const lng = props.lon ?? geometryLng
  const name = props.name ?? props.address_line1

  if (!name || lat == null || lng == null) {
    return null
  }

  return {
    id: props.place_id ?? `${lat}-${lng}-${index}`,
    name,
    address: props.formatted ?? props.address_line2 ?? 'Cerca de tu ubicación',
    distance: props.distance ?? null,
    rating: 4.6,
    price: 'Cerca',
    tags: getTags(props.categories ?? []),
    image: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    lat,
    lng,
  }
}

function getTags(categories: string[]): string[] {
  const labels = categories
    .flatMap(category => category.split('.'))
    .map(part => CATEGORY_LABELS[part])
    .filter((label): label is string => Boolean(label))

  return Array.from(new Set(labels)).slice(0, 2)
}
