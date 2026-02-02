import { defineConfig } from 'vite'
import type { Plugin, ViteDevServer } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import react from '@vitejs/plugin-react'

function llmProxyPlugin(): Plugin {
  return {
    name: 'llm-proxy',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/translate', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }

        const chunks: Buffer[] = []
        req.on('data', (chunk: Buffer) => chunks.push(chunk))
        req.on('end', async () => {
          try {
            const raw = Buffer.concat(chunks).toString('utf-8')
            const payload = JSON.parse(raw) as {
              apiUrl?: string
              apiKey?: string
              model?: string
              direction?: 'alpha-to-english' | 'english-to-alpha'
              text?: string
              temperature?: number
            }

            const apiUrl =
              payload.apiUrl ?? 'https://api.openai.com/v1/chat/completions'
            const apiKey = payload.apiKey ?? ''
            const model = payload.model ?? 'gpt-4.1'
            const text = payload.text ?? ''
            const direction = payload.direction ?? 'alpha-to-english'
            const temperature = payload.temperature ?? 0.2

            if (!apiKey) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Missing API key.' }))
              return
            }

            const upstream = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model,
                temperature,
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
                        ? `Translate this Gen Alpha slang to plain English: ${text}`
                        : `Translate this English sentence into Gen Alpha slang: ${text}`,
                  },
                ],
              }),
            })

            const responseText = await upstream.text()
            res.statusCode = upstream.status
            res.setHeader('Content-Type', 'application/json')
            res.end(responseText)
          } catch (error) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Proxy error.' }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), llmProxyPlugin()],
})
