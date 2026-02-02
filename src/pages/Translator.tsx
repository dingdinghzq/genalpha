import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Dropdown,
  makeStyles,
  Option,
  Spinner,
  Text,
  Textarea,
  tokens,
} from '@fluentui/react-components'
import { translateText } from '../services/llmClient'
import type { TranslationDirection } from '../services/llmClient'

const useStyles = makeStyles({
  layout: {
    display: 'grid',
    gap: tokens.spacingVerticalL,
  },
  card: {
    padding: tokens.spacingVerticalL,
    display: 'grid',
    gap: tokens.spacingVerticalM,
  },
  row: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
  },
  controls: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  textareas: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  },
  historyCard: {
    padding: tokens.spacingVerticalL,
    display: 'grid',
    gap: tokens.spacingVerticalM,
  },
  historyList: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
  },
  historyItem: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
    padding: tokens.spacingVerticalS,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  historyMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  historyActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  historyText: {
    whiteSpace: 'pre-wrap',
    display: 'block',
    lineHeight: '1.4em',
  },
  historyClamp: {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  historyExpand: {
    backgroundColor: 'transparent',
    border: 'none',
    color: tokens.colorBrandForeground1,
    padding: 0,
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.875rem',
  },
  description: {
    marginLeft: tokens.spacingHorizontalXS,
  },
})

type HistoryEntry = {
  id: string
  direction: TranslationDirection
  input: string
  output: string
  timestamp: string
}

const HISTORY_STORAGE_KEY = 'genalpha.translator.history'

const directionOptions: { label: string; value: TranslationDirection }[] = [
  { label: 'Gen Alpha → English', value: 'alpha-to-english' },
  { label: 'English → Gen Alpha', value: 'english-to-alpha' },
]

export default function Translator() {
  const styles = useStyles()
  const [direction, setDirection] = useState<TranslationDirection>('alpha-to-english')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const stored = window.localStorage.getItem(HISTORY_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as HistoryEntry[]
        if (Array.isArray(parsed)) {
          setHistory(parsed)
          if (parsed[0]) {
            setDirection(parsed[0].direction)
            setInput(parsed[0].input)
            setOutput(parsed[0].output)
          }
        }
      } catch {
        setHistory([])
      }
    }
  }, [])

  const historyEmpty = useMemo(() => history.length === 0, [history.length])

  const persistHistory = (items: HistoryEntry[]) => {
    setHistory(items)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items))
    }
  }

  const handleTranslate = async () => {
    setError(null)
    setLoading(true)
    try {
      const result = await translateText(input, direction)
      setOutput(result)
      const newEntry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        direction,
        input: input.trim(),
        output: result.trim(),
        timestamp: new Date().toISOString(),
      }
      const next = [newEntry, ...history].slice(0, 20)
      persistHistory(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteHistory = (id: string) => {
    const next = history.filter((entry) => entry.id !== id)
    persistHistory(next)
  }

  const handleClearHistory = () => {
    persistHistory([])
  }

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className={styles.layout}>
      <div>
        <Text as="h2" size={600} weight="semibold">
          Translator
        </Text>
        <Text size={400} className={styles.description}>
          Switch directions and translate slang using a live LLM backend (API key required).
        </Text>
      </div>

      <Card className={styles.card}>
        <div className={styles.controls}>
          <Dropdown
            value={directionOptions.find((option) => option.value === direction)?.label}
            selectedOptions={[direction]}
            onOptionSelect={(_, data) => {
              if (data.optionValue) {
                setDirection(data.optionValue as TranslationDirection)
              }
            }}
          >
            {directionOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Dropdown>
          <Button appearance="primary" onClick={handleTranslate} disabled={loading}>
            {loading ? 'Translating...' : 'Translate'}
          </Button>
          {loading && <Spinner size="small" />}
        </div>

        <div className={styles.textareas}>
          <div className={styles.row}>
            <Text size={300}>Input</Text>
            <Textarea
              value={input}
              onChange={(_, data) => setInput(data.value)}
              placeholder="Type a phrase or term..."
              resize="vertical"
              rows={5}
            />
          </div>
          <div className={styles.row}>
            <Text size={300}>Output</Text>
            <Textarea value={output} readOnly resize="vertical" rows={5} />
          </div>
        </div>

        {error && (
          <Text size={300} style={{ color: tokens.colorPaletteRedForeground1 }}>
            {error}
          </Text>
        )}
      </Card>

      <Card className={styles.historyCard}>
        <div className={styles.historyMeta}>
          <Text size={500} weight="semibold">
            Translation history
          </Text>
          <div className={styles.historyActions}>
            <Button appearance="secondary" onClick={handleClearHistory} disabled={historyEmpty}>
              Clear all
            </Button>
          </div>
        </div>

        {historyEmpty ? (
          <Text size={300}>No history yet. Run a translation to store it here.</Text>
        ) : (
          <div className={styles.historyList}>
            {history.map((entry) => (
              <div key={entry.id} className={styles.historyItem}>
                <div className={styles.historyMeta}>
                  <Text size={300}>
                    {entry.direction === 'alpha-to-english'
                      ? 'Gen Alpha → English'
                      : 'English → Gen Alpha'}
                  </Text>
                  <Button size="small" appearance="secondary" onClick={() => handleDeleteHistory(entry.id)}>
                    Delete
                  </Button>
                </div>
                <Text size={300}>
                  <strong>Input:</strong>
                </Text>
                <div
                  className={`${styles.historyText} ${
                    expandedIds.has(entry.id) ? '' : styles.historyClamp
                  }`}
                >
                  {entry.input}
                </div>
                <Text size={300}>
                  <strong>Output:</strong>
                </Text>
                <div
                  className={`${styles.historyText} ${
                    expandedIds.has(entry.id) ? '' : styles.historyClamp
                  }`}
                >
                  {entry.output}
                </div>
                {(entry.input.length > 120 || entry.output.length > 120) && (
                  <button className={styles.historyExpand} onClick={() => toggleExpanded(entry.id)}>
                    {expandedIds.has(entry.id) ? 'Less' : 'More'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
