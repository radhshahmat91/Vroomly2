# Vroomly — frontend

Next.js (App Router) + TypeScript + Tailwind CSS frontend for Vroomly.

See the [root README](../README.md) for the full project overview, setup instructions for both the frontend and backend, demo accounts, and architecture notes.

Quick start (assumes the backend is already running — see the root README):

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Visual assets

The homepage hero video is the user-provided `vroomly-hero.mp4`, compressed for web delivery and paired with a poster frame. Demo fleet vehicle artwork is bundled locally as lightweight model-specific SVG assets; see `/credits` in the app for the fleet asset list.
