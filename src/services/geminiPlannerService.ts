export interface DestinationRecommendation {
  name: string
  country: string
  summary: string
  bestFor: string
  highlights: string[]
}

export interface ActivityRecommendation {
  title: string
  category: string
  duration: string
  estimatedCost: string
  description: string
}

export interface HotelRecommendation {
  name: string
  area: string
  priceRange: string
  reason: string
}

export interface RestaurantRecommendation {
  name: string
  cuisine: string
  priceRange: string
  reason: string
}

export interface DailyPlanItem {
  time: string
  title: string
  description: string
}

export interface DailyPlan {
  day: number
  title: string
  items: DailyPlanItem[]
}

export interface GeminiTravelPlan {
  destination: string
  tripTitle: string
  duration: string
  budget: string
  overview: string
  estimatedTotal: string
  activities: ActivityRecommendation[]
  hotels: HotelRecommendation[]
  restaurants: RestaurantRecommendation[]
  dailyPlan: DailyPlan[]
}

export interface DestinationRequest {
  preference: string
}

export interface TravelPlanRequest {
  destination: string
  durationBudget: string
  activityPreferences: string
}

export async function getDestinationRecommendations({
  preference,
}: DestinationRequest): Promise<DestinationRecommendation[]> {
  return requestGeminiPlanner<DestinationRecommendation[]>('destinations', { preference })
}

export async function generateTravelPlan({
  destination,
  durationBudget,
  activityPreferences,
}: TravelPlanRequest): Promise<GeminiTravelPlan> {
  return requestGeminiPlanner<GeminiTravelPlan>('travel-plan', {
    destination,
    durationBudget,
    activityPreferences,
  })
}

async function requestGeminiPlanner<T>(action: string, payload: object): Promise<T> {
  const response = await fetch('/api/gemini-planner', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, payload }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.error ?? `Gemini planner request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}
