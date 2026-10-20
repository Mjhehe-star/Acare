# CareMate

This project is a working React + Vite app for a health companion interface called CareMate AI.

## Run locally

1. Install dependencies:
   npm install
2. Start the app:
   npm run dev
3. Open the local URL shown in the terminal (usually http://localhost:5173)

## Production build

npm run build

## Notes

- The app includes a working voice button using the browser SpeechRecognition API when supported.
- It also supports text input and mock health responses for medication reminders, appointments, and daily care guidance.
- This is a front-end prototype that runs locally without a backend.

## Project structure

- `src/App.jsx` — main UI and App logic
- `src/main.jsx` — app entry point
- `src/styles.css` — styling
- `index.html` — root HTML for Vite
- `vite.config.js` — Vite configuration
