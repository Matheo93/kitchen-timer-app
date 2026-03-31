# Kitchen Timer — Recipe Step Timer for Home Cooks

A visual step-by-step recipe timer. Each cooking stage has its own steam-pot visualization encoding progress through steam and heat arcs. Track every step, never lose your place.

**Live:** [https://thermo-test-boucle.vercel.app](https://thermo-test-boucle.vercel.app)
**GitHub:** [https://github.com/Matheo93/kitchen-timer-app](https://github.com/Matheo93/kitchen-timer-app)

## Features

- Steam pot canvas animation encodes cooking progress (steam, arc, heat)
- 4 sample recipes (Classic Bolognese, Dark Chocolate Cake, Herb Roasted Chicken, Wild Mushroom Risotto)
- Recipe difficulty filtering: All / Easy / Medium / Advanced
- EN / FR locale switching
- Dark mode with system preference detection
- Custom recipe creation with step editor and validation
- localStorage persistence for custom recipes
- PWA: installable, works offline (service worker cache)
- Haptic feedback on step completion (navigator.vibrate)
- Push notifications when timer step ends
- Keyboard shortcuts: Space (play/pause), Escape (back), Arrow keys (steps)
- 40 tests (hooks, storage, React components) — 0 TypeScript errors

## Tech Stack

- Next.js 15 App Router + TypeScript strict mode
- Tailwind CSS v4
- Framer Motion animations
- Zod validation
- Vitest + React Testing Library
- Playwright E2E tests
- Static export (output: "export") on Vercel CDN

## Development

```bash
bun install
bun dev          # http://localhost:3000
bun run test     # 40 tests
bun run build    # production build → ./out
bunx tsc --noEmit  # type check
```

## Deployment

Auto-deployed to Vercel on every push to `main` via GitHub integration.

```bash
# Manual deploy
vercel --prod
```
