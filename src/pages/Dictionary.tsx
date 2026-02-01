import { useMemo, useState } from 'react'
import { Badge, Card, Input, makeStyles, Text, tokens } from '@fluentui/react-components'
import { vocabulary } from '../data/vocabulary'

const useStyles = makeStyles({
  layout: {
    display: 'grid',
    gap: tokens.spacingVerticalL,
  },
  searchRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
    alignItems: 'center',
  },
  grid: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  },
  card: {
    padding: tokens.spacingVerticalL,
    display: 'grid',
    gap: tokens.spacingVerticalXS,
  },
  tags: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    flexWrap: 'wrap',
    marginTop: tokens.spacingVerticalXS,
  },
})

export default function Dictionary() {
  const styles = useStyles()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const lowered = query.trim().toLowerCase()
    if (!lowered) {
      return vocabulary
    }
    return vocabulary.filter((entry) => {
      return (
        entry.term.toLowerCase().includes(lowered) ||
        entry.meaning.toLowerCase().includes(lowered) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(lowered))
      )
    })
  }, [query])

  return (
    <div className={styles.layout}>
      <div>
        <Text as="h2" size={600} weight="semibold">
          Dictionary
        </Text>
        <Text size={400}>
          Search Gen Alpha terms, examples, and tags to keep your vocabulary up to date.
        </Text>
      </div>

      <div className={styles.searchRow}>
        <Input
          placeholder="Search by term, meaning, or tag..."
          value={query}
          onChange={(_, data) => setQuery(data.value)}
          style={{ minWidth: '280px' }}
        />
        <Text size={300}>{results.length} results</Text>
      </div>

      <div className={styles.grid}>
        {results.map((entry) => (
          <Card key={entry.term} className={styles.card}>
            <Text size={500} weight="semibold">
              {entry.term}
            </Text>
            <Text size={400}>{entry.meaning}</Text>
            <Text size={300}>
              <em>{entry.example}</em>
            </Text>
            <div className={styles.tags}>
              {entry.tags.map((tag) => (
                <Badge key={`${entry.term}-${tag}`} size="small">
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
