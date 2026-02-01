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

The app will fall back to the built-in dictionary-based mock translation when these values are not provided.
