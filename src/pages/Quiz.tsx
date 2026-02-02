import { useState } from 'react'
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
import { CheckmarkCircle24Regular, DismissCircle24Regular, ArrowClockwise24Regular } from '@fluentui/react-icons'
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
    maxWidth: '600px',
    margin: '0 auto',
    width: '100%',
  },
  card: {
    padding: tokens.spacingVerticalL,
    display: 'grid',
    gap: tokens.spacingVerticalM,
    minHeight: '300px',
  },
  progress: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: tokens.spacingVerticalL,
  },
  summaryList: {
    display: 'grid',
    gap: tokens.spacingVerticalM,
  },
  summaryItem: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    alignItems: 'start',
  },
  summaryContent: {
    display: 'grid',
    gap: tokens.spacingVerticalXS,
  },
  description: {
    marginLeft: tokens.spacingHorizontalXS,
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    marginTop: tokens.spacingVerticalM,
  },
  scoreSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalXL,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusLarge,
  }
})

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5)
}

function buildQuiz(pool = vocabulary, total = 5): QuizQuestion[] {
  const safeTotal = Math.min(total, pool.length);
  const picks = shuffle(pool).slice(0, safeTotal)
  return picks.map((entry) => {
    const distractors = shuffle(pool)
      .filter((item) => item.term !== entry.term)
      .slice(0, 3)
      .map((item) => item.meaning)

    const options = shuffle([entry.meaning, ...distractors]);
    return {
      prompt: `What does “${entry.term}” mean?`,
      answer: entry.meaning,
      options: options,
    }
  })
}

export default function Quiz() {
  const styles = useStyles()
  
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => buildQuiz())
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [isFinished, setIsFinished] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleNext = () => {
    if (!selectedOption) return;

    const newAnswers = [...userAnswers, selectedOption];
    setUserAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  }

  const handleReset = () => {
    setQuestions(buildQuiz());
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setIsFinished(false);
    setSelectedOption(null);
  }

  const score = userAnswers.reduce((acc, answer, index) => {
    return answer === questions[index]?.answer ? acc + 1 : acc;
  }, 0);

  if (isFinished) {
    return (
       <div className={styles.layout}>
        <Text as="h2" size={600} weight="semibold">Quiz Results</Text>
        
        <div className={styles.scoreSection}>
           <Text size={800} weight="bold">{score} / {questions.length}</Text>
           <Text size={400}>You got {score} out of {questions.length} questions correct!</Text>
           <Button icon={<ArrowClockwise24Regular />} size="large" appearance="primary" onClick={handleReset}>
             Try Again
           </Button>
        </div>

        <div className={styles.summaryList}>
            {questions.map((q, i) => {
                const isCorrect = userAnswers[i] === q.answer;
                return (
                    <div key={i} className={styles.summaryItem} style={{ 
                        borderColor: isCorrect ? tokens.colorPaletteGreenBorderActive : tokens.colorPaletteRedBorderActive,
                        backgroundColor: isCorrect ? tokens.colorPaletteGreenBackground1 : tokens.colorPaletteRedBackground1
                    }}> 
                        {isCorrect ? 
                            <CheckmarkCircle24Regular primaryFill={tokens.colorPaletteGreenForeground1} /> : 
                            <DismissCircle24Regular primaryFill={tokens.colorPaletteRedForeground1} />
                        }
                        <div className={styles.summaryContent}>
                            <Text weight="semibold">{q.prompt}</Text>
                            <Text size={300}>Your answer: <b>{userAnswers[i]}</b></Text>
                            {!isCorrect && <Text size={300}>Correct answer: <b>{q.answer}</b></Text>}
                        </div>
                    </div>
                )
            })}
        </div>
       </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={styles.layout}>
      <div>
        <Text as="h2" size={600} weight="semibold">
          GenAlpha Quiz
        </Text>
        <Text size={400} className={styles.description}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
      </div>

      <ProgressBar value={currentQuestionIndex} max={questions.length} />

      <Card className={styles.card}>
        <Text size={600} weight="semibold">
          {currentQuestion.prompt}
        </Text>
        
        <RadioGroup
            className={styles.radioGroup}
            value={selectedOption || ''}
            onChange={(_, data) => setSelectedOption(data.value)}
        >
            {currentQuestion.options.map((option) => (
              <Radio key={option} value={option} label={option} />
            ))}
        </RadioGroup>

        <div className={styles.actions}>
            <Button 
                appearance="primary" 
                onClick={handleNext}
                disabled={!selectedOption}
            >
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
        </div>
      </Card>
    </div>
  )
}
