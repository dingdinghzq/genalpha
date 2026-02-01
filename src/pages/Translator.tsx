import { useState } from 'react'
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
  description: {
    marginLeft: tokens.spacingHorizontalXS,
  },
})

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

  const handleTranslate = async () => {
    setError(null)
    setLoading(true)
    try {
      const result = await translateText(input, direction)
      setOutput(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed.')
    } finally {
      setLoading(false)
    }
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
    </div>
  )
}
