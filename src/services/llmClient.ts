import { vocabulary } from '../data/vocabulary'

export type TranslationDirection = 'alpha-to-english' | 'english-to-alpha'

export async function translateText(
  input: string,
  direction: TranslationDirection,
): Promise<string> {
  const trimmed = input.trim()
  if (!trimmed) {
    return ''
  }

  const apiUrl =
    getStoredValue(LLM_STORAGE_KEYS.apiUrl) ?? import.meta.env.VITE_LLM_API_URL ?? undefined
  const apiKey = sanitizeApiKey(
    getStoredValue(LLM_STORAGE_KEYS.apiKey) ?? import.meta.env.VITE_LLM_API_KEY,
  )
  const model = getStoredValue(LLM_STORAGE_KEYS.model) ?? import.meta.env.VITE_LLM_MODEL ?? undefined
  const temperatureValue =
    getStoredValue(LLM_STORAGE_KEYS.temperature) ?? import.meta.env.VITE_LLM_TEMPERATURE
  const temperature = temperatureValue ? Number(temperatureValue) : undefined

  if (!apiKey) {
    return mockTranslate(trimmed, direction)
  }
  const body: Record<string, unknown> = {
    apiKey,
    direction,
    text: trimmed,
  }

  if (apiUrl) {
    body.apiUrl = apiUrl
  }

  if (model) {
    body.model = model
  }

  if (typeof temperature === 'number' && !Number.isNaN(temperature)) {
    body.temperature = temperature
  }

  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    const statusLabel = response.status === 401 ? 'Unauthorized' : `HTTP ${response.status}`
    const details = errorText ? ` - ${errorText}` : ''
    throw new Error(`${statusLabel}: translation request failed${details}`)
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }

  const content = data.choices?.[0]?.message?.content?.trim()
  return content && content.length > 0 ? content : mockTranslate(trimmed, direction)
}

export const LLM_STORAGE_KEYS = {
  apiKey: 'genalpha.llm.apiKey',
  apiUrl: 'genalpha.llm.apiUrl',
  model: 'genalpha.llm.model',
  temperature: 'genalpha.llm.temperature',
}

export function getStoredValue(key: string) {
  if (typeof window === 'undefined') {
    return null
  }
  return window.localStorage.getItem(key)
}

export function sanitizeApiKey(value?: string | null) {
  if (!value) {
    return ''
  }
  const trimmed = value.trim()
  const withoutBearer = trimmed.replace(/^Bearer\s+/i, '')
  const withoutQuotes = withoutBearer.replace(/^"(.+)"$/, '$1')
  return withoutQuotes.replace(/\s+/g, '')
}

function mockTranslate(input: string, direction: TranslationDirection): string {
  const normalized = input.toLowerCase()

  if (direction === 'alpha-to-english') {
    const hit = vocabulary.find((entry) => entry.term.toLowerCase() === normalized)
    return hit?.meaning ?? `No direct match. Try the dictionary for more context.`
  }

  const hit = vocabulary.find((entry) => entry.meaning.toLowerCase() === normalized)
  return hit?.term ?? `No direct match. Try describing it another way.`
}
