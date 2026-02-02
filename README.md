# Gen Alpha Language Lab

A Microsoft Fluent UI web experience for learning Gen Alpha vocabulary. The app includes a searchable dictionary, flashcards, a quiz, and a bi-directional translator with an optional LLM backend.

## Features

- Dictionary with tags and examples
- Flashcards for memorization
- Quiz to test knowledge
- Bi-directional translator (Gen Alpha ↔ English)
- Fluent design language styling

## Getting started

Install dependencies and start the development server:

- `npm install`
- `npm run dev`

## LLM translation (optional)

Set the following environment variables to enable live translation:

- `VITE_LLM_API_URL` – URL for your translation endpoint
- `VITE_LLM_API_KEY` – API key/token (keep it private)
- `VITE_LLM_MODEL` – Model name (optional)
- `VITE_LLM_TEMPERATURE` – Randomness (lower = more predictable)

The app will fall back to the built-in dictionary-based mock translation when these values are not provided.

Create a local file called `.env.local` (gitignored) using [.env.example](.env.example) as a template.

You can also set the endpoint, model, API key, and temperature in the Settings page; values are stored in your browser localStorage only. For mini or nano models, set temperature to 1.

The app uses a same-origin `/api/translate` proxy (dev server and production server) to avoid browser CORS issues.

## Docker

Build and run the container:

- `docker build -t genalpha .`
- `docker run --rm -p 8080:3000 genalpha`

For local keys, keep `.env.local` on your machine only.

## Production server

- `npm run build`
- `npm run start`
