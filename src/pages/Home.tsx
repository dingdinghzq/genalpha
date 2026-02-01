import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, makeStyles, Text, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  hero: {
    display: 'grid',
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalXXL,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  heroActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
  grid: {
    marginTop: tokens.spacingVerticalXL,
    display: 'grid',
    gap: tokens.spacingVerticalL,
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  },
  card: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
    padding: tokens.spacingVerticalL,
  },
  cardLink: {
    textDecoration: 'none',
  },
})

const features = [
  {
    title: 'Dictionary',
    description: 'Browse a curated list of Gen Alpha terms, meanings, and examples.',
    link: '/dictionary',
  },
  {
    title: 'Flashcards',
    description: 'Memorize slang with quick flips and focused practice.',
    link: '/flashcards',
  },
  {
    title: 'Quiz',
    description: 'Test your knowledge with multiple choice challenges.',
    link: '/quiz',
  },
  {
    title: 'Translator',
    description: 'Convert Gen Alpha slang to English and back again.',
    link: '/translator',
  },
]

export default function Home() {
  const styles = useStyles()
  const navigate = useNavigate()

  return (
    <div>
      <section className={styles.hero}>
        <Text as="h2" size={700} weight="semibold">
            Speak Gen Alpha with confidence.
        </Text>
        <Text size={400}>
          Dive into the latest vocabulary, study with flashcards, and translate slang in real
          time. Designed with Microsoft Fluent UI for a polished, modern experience.
        </Text>
        <div className={styles.heroActions}>
          <Button appearance="primary" onClick={() => navigate('/translator')}>
            Try the translator
          </Button>
          <Button appearance="secondary" onClick={() => navigate('/dictionary')}>
            Explore dictionary
          </Button>
        </div>
      </section>

      <section className={styles.grid}>
        {features.map((feature) => (
          <Link key={feature.title} to={feature.link} className={styles.cardLink}>
            <Card className={styles.card}>
              <Text as="h3" size={500} weight="semibold">
                {feature.title}
              </Text>
              <Text size={400}>{feature.description}</Text>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  )
}
