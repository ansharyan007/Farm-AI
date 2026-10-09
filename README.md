# Farm AI

Farm AI is a React Native field intelligence companion for crop health, irrigation decisions, and farmer questions.

## Product direction

- Field health overview with soil, weather, and plot signals
- Context-aware plant disease scan flow
- Seven-day field insights and recommended actions
- Farm AI Copilot conversation starter

This repository currently ships a polished mobile prototype with local demo data. The next production layer is to connect the scan screen to a trained PyTorch inference API, a weather provider, and geospatial plot boundaries through environment variables.

## Run locally

```bash
npm install
npm start
npm run android
```

## Model roadmap

The app UI is designed around a calibrated classifier response: predicted disease, confidence, severity, crop context, and recommended actions. A production model should be evaluated per crop and region, with an uncertainty threshold that routes low-confidence cases to an agronomist instead of presenting a definitive diagnosis.
