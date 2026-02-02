import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

app.use(express.json({ limit: '1mb' }))

app.post('/api/translate', async (req, res) => {
  try {
    const { apiUrl, apiKey, model, direction, text, temperature } = req.body ?? {}

    if (!apiKey) {
      res.status(400).json({ error: 'Missing API key.' })
      return
    }

    const upstream = await fetch(apiUrl ?? 'https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model ?? 'gpt-5-nano',
        temperature: temperature ?? 0.2,
        messages: [
          {
            role: 'system',
            content:
              'You are a translator for Gen Alpha slang. Return only the translated text without quotes or extra commentary.',
          },
          {
            role: 'user',
            content:
              direction === 'alpha-to-english'
                ? `Translate this Gen Alpha slang to plain English: ${text ?? ''}`
                : `Translate this English sentence into Gen Alpha slang: ${text ?? ''}`,
          },
        ],
      }),
    })

    const responseText = await upstream.text()
    res.status(upstream.status).type('application/json').send(responseText)
  } catch (error) {
    res.status(500).json({ error: 'Proxy error.' })
  }
})

const distPath = path.resolve(__dirname, '..', 'dist')
app.use(express.static(distPath))
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
