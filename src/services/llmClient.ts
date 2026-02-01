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

  const apiUrl = import.meta.env.VITE_LLM_API_URL
  const apiKey = import.meta.env.VITE_LLM_API_KEY

  if (!apiUrl || !apiKey) {
    return mockTranslate(trimmed, direction)
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      text: trimmed,
      direction,
    }),
  })

  if (!response.ok) {
    throw new Error('Translation request failed.')
  }

  const data = (await response.json()) as {
    translation?: string
    output?: string
    result?: string
  }

  return data.translation ?? data.output ?? data.result ?? mockTranslate(trimmed, direction)
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
