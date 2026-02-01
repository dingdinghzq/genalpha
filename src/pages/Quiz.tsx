import { useMemo, useState } from 'react'
import {
  Button,
  Card,
  makeStyles,
  ProgressBar,
  Radio,
  RadioGroup,
  Text,
  tokens,
} from '@fluentui/react-components'
import { vocabulary } from '../data/vocabulary'

type QuizQuestion = {
  prompt: string
  answer: string
  options: string[]
}

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
  progress: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
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

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5)
}

function buildQuiz(pool = vocabulary, total = 5): QuizQuestion[] {
  const picks = shuffle(pool).slice(0, total)
  return picks.map((entry) => {
    const distractors = shuffle(pool)
      .filter((item) => item.term !== entry.term)
      .slice(0, 3)
      .map((item) => item.meaning)

    return {
      prompt: `What does “${entry.term}” mean?`,
      answer: entry.meaning,
      options: shuffle([entry.meaning, ...distractors]),
    }
  })
}

export default function Quiz() {
  const styles = useStyles()
  const questions = useMemo(() => buildQuiz(vocabulary, 5), [])
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array.from({ length: questions.length }, () => null),
  )

  const answeredCount = answers.filter(Boolean).length
  const score = answers.reduce((acc, answer, index) => {
    if (answer && answer === questions[index].answer) {
      return acc + 1
    }
    return acc
  }, 0)

  const handleReset = () => {
    setAnswers(Array.from({ length: questions.length }, () => null))
  }

  return (
    <div className={styles.layout}>
      <div>
        <Text as="h2" size={600} weight="semibold">
          Quiz
        </Text>
        <Text size={400} className={styles.description}>
          Check your Gen Alpha knowledge with quick prompts.
        </Text>
      </div>

      <div className={styles.progress}>
        <Text size={300}>
          Answered {answeredCount} / {questions.length}
        </Text>
        <ProgressBar value={answeredCount} max={questions.length} />
        <Text size={300}>Score: {score}</Text>
      </div>

      {questions.map((question, index) => (
        <Card key={question.prompt} className={styles.card}>
          <Text size={500} weight="semibold">
            {question.prompt}
          </Text>
          <RadioGroup
            value={answers[index] ?? undefined}
            onChange={(_, data) => {
              const updated = [...answers]
              updated[index] = data.value
              setAnswers(updated)
            }}
          >
            {question.options.map((option) => (
              <Radio key={option} value={option} label={option} />
            ))}
          </RadioGroup>
        </Card>
      ))}

      <div className={styles.actions}>
        <Button appearance="secondary" onClick={handleReset}>
          Reset quiz
        </Button>
      </div>
    </div>
  )
}
