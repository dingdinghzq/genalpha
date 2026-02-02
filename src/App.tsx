import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import {
  FluentProvider,
  makeStyles,
  Text,
  tokens,
  webLightTheme,
} from '@fluentui/react-components'
import {
  BookRegular,
  HomeRegular,
  NotebookRegular,
  QuizNewRegular,
  SettingsRegular,
  TranslateRegular,
} from '@fluentui/react-icons'
import './App.css'
import Dictionary from './pages/Dictionary'
import Flashcards from './pages/Flashcards'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Settings from './pages/Settings'
import Translator from './pages/Translator'

const useStyles = makeStyles({
  app: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  headerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    display: 'flex',
    gap: tokens.spacingHorizontalL,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  navLink: {
    textDecoration: 'none',
    color: tokens.colorNeutralForeground2,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusMedium,
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    fontSize: '0.95rem',
  },
  navLinkActive: {
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorBrandBackground2,
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${tokens.spacingVerticalXL} ${tokens.spacingHorizontalL}`,
  },
  footer: {
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  footerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
  },
})

function App() {
  const styles = useStyles()

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.app}>
        <BrowserRouter>
          <header className={styles.header}>
            <div className={styles.headerInner}>
              <div className={styles.brand}>
                <Text as="h1" size={600} weight="semibold">
                  Gen Alpha Language Lab
                </Text>
                <Text size={300}>
                  Dictionary, flashcards, quizzes, and live translation.
                </Text>
              </div>
              <nav className={styles.nav}>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  <HomeRegular /> Home
                </NavLink>
                <NavLink
                  to="/dictionary"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  <BookRegular /> Dictionary
                </NavLink>
                <NavLink
                  to="/flashcards"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  <NotebookRegular /> Flashcards
                </NavLink>
                <NavLink
                  to="/quiz"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  <QuizNewRegular /> Quiz
                </NavLink>
                <NavLink
                  to="/translator"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  <TranslateRegular /> Translator
                </NavLink>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  <SettingsRegular /> Settings
                </NavLink>
              </nav>
            </div>
          </header>

          <main className={styles.main}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dictionary" element={<Dictionary />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/translator" element={<Translator />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>

          <footer className={styles.footer}>
            <div className={styles.footerInner}>
              <Text size={300}>
                Built with Microsoft Fluent design and Gen Alpha vibes.
              </Text>
              <Text size={300}>Add your LLM key anytime to enable live translation.</Text>
            </div>
          </footer>
        </BrowserRouter>
      </div>
    </FluentProvider>
  )
}

export default App
