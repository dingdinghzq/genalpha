import { useMemo, useState } from 'react'
import { Button, Card, Input, makeStyles, Text, tokens } from '@fluentui/react-components'
import { getStoredValue, LLM_STORAGE_KEYS, sanitizeApiKey } from '../services/llmClient'

const useStyles = makeStyles({
  layout: {
    display: 'grid',
    gap: tokens.spacingVerticalL,
  },
  card: {
    padding: tokens.spacingVerticalL,
    display: 'grid',
    gap: tokens.spacingVerticalM,
    maxWidth: '640px',
  },
  cardFullWidth: {
    width: '100%',
  },
  row: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
  },
  input: {
    width: '100%',
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
  description: {
    marginLeft: tokens.spacingHorizontalXS,
  },
})

export default function Settings() {
  const styles = useStyles()
  const storedKey = useMemo(() => getStoredValue(LLM_STORAGE_KEYS.apiKey), [])
  const storedUrl = useMemo(() => getStoredValue(LLM_STORAGE_KEYS.apiUrl), [])
  const storedModel = useMemo(() => getStoredValue(LLM_STORAGE_KEYS.model), [])
  const storedTemperature = useMemo(() => getStoredValue(LLM_STORAGE_KEYS.temperature), [])

  const [apiKey, setApiKey] = useState(storedKey ?? '')
  const [apiUrl, setApiUrl] = useState(storedUrl ?? '')
  const [model, setModel] = useState(storedModel ?? 'gpt-5-nano')
  const [temperature, setTemperature] = useState(storedTemperature ?? '')
  const [status, setStatus] = useState<'idle' | 'saved' | 'cleared' | 'testing'>('idle')
  const [testMessage, setTestMessage] = useState<string | null>(null)
  const handleSave = () => {
    if (typeof window === 'undefined') {
      return
    }
    const cleanedKey = sanitizeApiKey(apiKey)
    window.localStorage.setItem(LLM_STORAGE_KEYS.apiKey, cleanedKey)
    window.localStorage.setItem(LLM_STORAGE_KEYS.apiUrl, apiUrl.trim())
    window.localStorage.setItem(LLM_STORAGE_KEYS.model, model.trim())
    window.localStorage.setItem(LLM_STORAGE_KEYS.temperature, temperature.trim())
    setApiKey(cleanedKey)
    setStatus('saved')
    setTestMessage(null)
  }

  const handleClear = () => {
    if (typeof window === 'undefined') {
      return
    }
    window.localStorage.removeItem(LLM_STORAGE_KEYS.apiKey)
    window.localStorage.removeItem(LLM_STORAGE_KEYS.apiUrl)
    window.localStorage.removeItem(LLM_STORAGE_KEYS.model)
    window.localStorage.removeItem(LLM_STORAGE_KEYS.temperature)
    setApiKey('')
    setApiUrl('')
    setModel('gpt-5-nano')
    setTemperature('')
    setStatus('cleared')
    setTestMessage(null)
  }

  const handleTest = async () => {
    const cleanedKey = sanitizeApiKey(apiKey)
    if (!cleanedKey || !model.trim() || !temperature.trim()) {
      setTestMessage('Please provide model, temperature, and API key first.')
      return
    }

    setStatus('testing')
    setTestMessage(null)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiUrl: apiUrl.trim() || undefined,
          apiKey: cleanedKey,
          model: model.trim(),
          direction: 'alpha-to-english',
          text: 'rizz',
          temperature: Number(temperature) || 0.2,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        setTestMessage(`Test failed: ${errorText}`)
        setStatus('idle')
        return
      }

      setTestMessage('Test passed. API key is working.')
      setStatus('idle')
    } catch (error) {
      setTestMessage('Test failed due to a network or proxy error.')
      setStatus('idle')
    }
  }

  return (
    <div className={styles.layout}>
      <div>
        <Text as="h2" size={600} weight="semibold">
          Settings
        </Text>
        <Text size={400} className={styles.description}>
          Store your LLM endpoint, model, temperature, and API key locally in this browser.
        </Text>
      </div>

      <Card className={`${styles.card} ${styles.cardFullWidth}`}>
        <div className={styles.row}>
          <Text size={300}>Endpoint URL</Text>
          <Input
            value={apiUrl}
            onChange={(_, data) => {
              setApiUrl(data.value)
              setStatus('idle')
            }}
            placeholder="https://api.openai.com/v1/chat/completions"
            className={styles.input}
          />
        </div>
        <div className={styles.row}>
          <Text size={300}>Model</Text>
          <Input
            value={model}
            onChange={(_, data) => {
              setModel(data.value)
              setStatus('idle')
            }}
            placeholder="gpt-5-nano"
            className={styles.input}
          />
        </div>
        <div className={styles.row}>
          <Text size={300}>Temperature</Text>
          <Input
            value={temperature}
            onChange={(_, data) => {
              setTemperature(data.value)
              setStatus('idle')
            }}
            placeholder="0.2"
            className={styles.input}
          />
          <Text size={300}>
            Temperature controls randomness. Lower = more predictable. For mini or nano models, set
            temperature to 1.
          </Text>
        </div>
        <div className={styles.row}>
          <Text size={300}>LLM API key</Text>
          <Input
            type="password"
            value={apiKey}
            onChange={(_, data) => {
              setApiKey(data.value)
              setStatus('idle')
            }}
            placeholder="Paste your key here"
            className={styles.input}
          />
          <Text size={300}>
            Key length: {sanitizeApiKey(apiKey).length} · Starts with sk-:{' '}
            {sanitizeApiKey(apiKey).startsWith('sk-') ? 'yes' : 'no'}
          </Text>
        </div>

        <div className={styles.actions}>
          <Button
            appearance="primary"
            onClick={handleSave}
            disabled={!apiKey.trim() || !model.trim() || !temperature.trim()}
          >
            Save key locally
          </Button>
          <Button appearance="secondary" onClick={handleTest} disabled={status === 'testing'}>
            {status === 'testing' ? 'Testing...' : 'Test key'}
          </Button>
          <Button appearance="secondary" onClick={handleClear}>
            Clear local key
          </Button>
        </div>

        {status === 'saved' && (
          <Text size={300}>Key saved locally. Refresh Translator to use it.</Text>
        )}
        {status === 'cleared' && (
          <Text size={300}>Local key cleared. Translator will use mock mode.</Text>
        )}
        {testMessage && <Text size={300}>{testMessage}</Text>}
      </Card>
    </div>
  )
}
