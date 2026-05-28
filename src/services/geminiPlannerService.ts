import { GoogleGenAI, Type } from '@google/genai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const MODEL = import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-2.5-flash'
const SYSTEM_INSTRUCTION =
  'Eres un asistente experto de viajes para Isiplan. Usa informacion actual cuando este disponible y responde siempre en espanol latinoamericano.'

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null

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

const destinationResponseSchema = {
  type: Type.OBJECT,
  properties: {
    destinations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          country: { type: Type.STRING },
          summary: { type: Type.STRING },
          bestFor: { type: Type.STRING },
          highlights: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['name', 'country', 'summary', 'bestFor', 'highlights'],
      },
    },
  },
  required: ['destinations'],
}

const travelPlanResponseSchema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING },
    tripTitle: { type: Type.STRING },
    duration: { type: Type.STRING },
    budget: { type: Type.STRING },
    overview: { type: Type.STRING },
    estimatedTotal: { type: Type.STRING },
    activities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          category: { type: Type.STRING },
          duration: { type: Type.STRING },
          estimatedCost: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ['title', 'category', 'duration', 'estimatedCost', 'description'],
      },
    },
    hotels: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          area: { type: Type.STRING },
          priceRange: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ['name', 'area', 'priceRange', 'reason'],
      },
    },
    restaurants: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          cuisine: { type: Type.STRING },
          priceRange: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ['name', 'cuisine', 'priceRange', 'reason'],
      },
    },
    dailyPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          title: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ['time', 'title', 'description'],
            },
          },
        },
        required: ['day', 'title', 'items'],
      },
    },
  },
  required: [
    'destination',
    'tripTitle',
    'duration',
    'budget',
    'overview',
    'estimatedTotal',
    'activities',
    'hotels',
    'restaurants',
    'dailyPlan',
  ],
}

export async function getDestinationRecommendations({
  preference,
}: DestinationRequest): Promise<DestinationRecommendation[]> {
  const prompt = `Recomienda 3 destinos reales para un viajero que busca: ${preference}. Incluye lugares de interes, el tipo de experiencia y por que encajan.`

  const groundedContext = await getOptionalGroundedContext(prompt)
  const data = await generateJson<{ destinations: DestinationRecommendation[] }>({
    prompt: buildStructuredPrompt(prompt, groundedContext),
    responseSchema: destinationResponseSchema,
  })

  return data.destinations.slice(0, 3)
}

export async function generateTravelPlan({
  destination,
  durationBudget,
  activityPreferences,
}: TravelPlanRequest): Promise<GeminiTravelPlan> {
  const prompt = `Genera un plan turistico actualizado para ${destination}. Duracion y presupuesto del usuario: ${durationBudget}. Preferencias de actividades: ${activityPreferences}. Incluye actividades concretas que se puedan realizar ahi, hoteles recomendados, restaurantes recomendados, presupuesto estimado y un itinerario por dias.`

  const groundedContext = await getOptionalGroundedContext(prompt)

  return generateJson<GeminiTravelPlan>({
    prompt: buildStructuredPrompt(prompt, groundedContext),
    responseSchema: travelPlanResponseSchema,
  })
}

async function getOptionalGroundedContext(prompt: string): Promise<string | null> {
  try {
    return await generateGroundedContext(prompt)
  } catch (error) {
    console.warn('Gemini search context failed; falling back to structured generation only.', getGeminiErrorSummary(error))
    return null
  }
}

async function generateGroundedContext(prompt: string): Promise<string> {
  if (!ai) {
    throw new Error('Gemini API key is not configured')
  }

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `${prompt}\n\nBusca informacion reciente y resume datos concretos utiles para recomendar lugares de interes, actividades, hoteles y restaurantes. No devuelvas JSON en este paso.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }],
      temperature: 0.4,
    },
  })

  const text = response.text?.trim()

  if (!text) {
    throw new Error('Gemini returned an empty search response')
  }

  return text
}

async function generateJson<T>({
  prompt,
  responseSchema,
}: {
  prompt: string
  responseSchema: object
}): Promise<T> {
  if (!ai) {
    throw new Error('Gemini API key is not configured')
  }

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: `${SYSTEM_INSTRUCTION} Devuelve unicamente JSON valido segun el schema solicitado.`,
      responseMimeType: 'application/json',
      responseSchema,
      temperature: 0.7,
    },
  })

  const text = response.text

  if (!text) {
    throw new Error('Gemini returned an empty response')
  }

  return JSON.parse(extractJson(text)) as T
}

function buildStructuredPrompt(prompt: string, groundedContext: string | null): string {
  if (!groundedContext) {
    return prompt
  }

  return `${prompt}\n\nInformacion recopilada previamente con busqueda web:\n${groundedContext}\n\nUsa esa informacion como contexto y genera la respuesta estructurada.`
}

function getGeminiErrorSummary(error: unknown): string {
  if (error instanceof Error) {
    return error.message.slice(0, 240)
  }

  return String(error).slice(0, 240)
}

function extractJson(text: string): string {
  const trimmed = text.trim()

  if (!trimmed.startsWith('```')) {
    return trimmed
  }

  return trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
}
