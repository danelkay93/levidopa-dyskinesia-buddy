# Levodopa Day Map

A phone-first, static medication-schedule visualizer for exploring a deterministic levodopa schedule model.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm test
npm run build
npx playwright install webkit
npm run test:e2e
```

The app stores schedules locally and can encode a versioned synthetic schedule in a URL. It has no backend, authentication, analytics, remote logging, database, or cloud patient-data storage.

The model is an explanatory deterministic schedule model, not measured levodopa, a symptom predictor, or dosing advice.
