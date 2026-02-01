import { useMemo, useState } from 'react'
import { Button, Card, makeStyles, Text, tokens } from '@fluentui/react-components'
import { vocabulary } from '../data/vocabulary'

const useStyles = makeStyles({
  layout: {
    display: 'grid',
    gap: tokens.spacingVerticalL,
  },
  card: {
    padding: tokens.spacingVerticalXXL,
    display: 'grid',
    gap: tokens.spacingVerticalM,
    textAlign: 'center',
    minHeight: '220px',
    alignItems: 'center',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
})

export default function Flashcards() {
  const styles = useStyles()
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const entries = useMemo(() => vocabulary, [])
  const current = entries[index]

  const handleNext = () => {
    setRevealed(false)
    setIndex((prev) => (prev + 1) % entries.length)
  }

  const handlePrev = () => {
    setRevealed(false)
    setIndex((prev) => (prev - 1 + entries.length) % entries.length)
  }

  return (
    <div className={styles.layout}>
      <div>
        <Text as="h2" size={600} weight="semibold">
          Flashcards
        </Text>
        <Text size={400}>Tap to reveal the meaning and practice on the go.</Text>
      </div>

      <Card className={styles.card}>
        <Text size={500} weight="semibold">
          {revealed ? current.meaning : current.term}
        </Text>
        <Text size={300}>
          {revealed ? current.example : 'Click “Reveal” to show the meaning.'}
        </Text>
      </Card>

      <div className={styles.controls}>
        <Button appearance="secondary" onClick={handlePrev}>
          Previous
        </Button>
        <Button appearance="primary" onClick={() => setRevealed((prev) => !prev)}>
          {revealed ? 'Hide' : 'Reveal'}
        </Button>
        <Button appearance="secondary" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  )
}
