import { useEffect, useMemo, useState } from 'react'
import { Button, makeStyles, Text, tokens } from '@fluentui/react-components'
import { vocabulary } from '../data/vocabulary'

const useStyles = makeStyles({
  layout: {
    display: 'grid',
    gap: tokens.spacingVerticalL,
    maxWidth: '500px',
    margin: '0 auto',
    width: '100%',
  },
  scene: {
    width: '100%',
    height: '320px',
    perspective: '1000px',
    cursor: 'pointer',
  },
  cardWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
    transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
    transformStyle: 'preserve-3d',
  },
  flipped: {
    transform: 'rotateY(180deg)',
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: tokens.borderRadiusXLarge,
    boxShadow: tokens.shadow16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacingVerticalXXL,
    boxSizing: 'border-box',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  cardBack: {
    transform: 'rotateY(180deg)',
    backgroundColor: tokens.colorNeutralBackground1, // Keep same background for consistency or change for effect
    border: `2px solid ${tokens.colorBrandStroke1}`, // Subtle border change to indicate "answer side"
  },
  cardFrontAccent: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '6px',
    background: `linear-gradient(90deg, ${tokens.colorBrandBackground}, ${tokens.colorPaletteBlueBorderActive})`,
    borderTopLeftRadius: tokens.borderRadiusXLarge,
    borderTopRightRadius: tokens.borderRadiusXLarge,
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
  description: {
    marginLeft: tokens.spacingHorizontalXS,
  },
  hint: {
    position: 'absolute',
    bottom: tokens.spacingVerticalL,
    color: tokens.colorNeutralForeground4,
  },
})

export default function Flashcards() {
  const styles = useStyles()
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const entries = useMemo(() => vocabulary, [])
  const current = entries[index]

  const pickRandomIndex = () => {
    if (entries.length <= 1) {
      return 0
    }
    let next = Math.floor(Math.random() * entries.length)
    if (next === index) {
      next = (next + 1) % entries.length
    }
    return next
  }

  useEffect(() => {
    setIndex(pickRandomIndex())
  }, [])

  const handleNext = () => {
    setRevealed(false)
    setIndex(pickRandomIndex())
  }

  return (
    <div className={styles.layout}>
      <div>
        <Text as="h2" size={600} weight="semibold">
          Flashcards
        </Text>
        <Text size={400} className={styles.description}>
          Tap to reveal the meaning and practice on the go.
        </Text>
      </div>

      <div className={styles.scene} onClick={() => setRevealed(!revealed)}>
        <div className={`${styles.cardWrapper} ${revealed ? styles.flipped : ''}`}>
          {/* Front */}
          <div className={styles.cardFace}>
            <div className={styles.cardFrontAccent} />
            <Text size={800} weight="semibold" align="center">
              {current.term}
            </Text>
            <Text className={styles.hint} size={200}>
              Tap to see meaning
            </Text>
          </div>

          {/* Back */}
          <div className={`${styles.cardFace} ${styles.cardBack}`}>
            <Text size={600} weight="semibold" align="center" style={{ marginBottom: tokens.spacingVerticalM }}>
              {current.meaning}
            </Text>
            <Text size={400} italic align="center">
              {current.example}
            </Text>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <Button appearance="secondary" onClick={handleNext}>
          Pick Another
        </Button>
        <Button appearance="primary" onClick={() => setRevealed((prev) => !prev)}>
          {revealed ? 'Show Term' : 'Show Meaning'}
        </Button>
      </div>
    </div>
  )
}
