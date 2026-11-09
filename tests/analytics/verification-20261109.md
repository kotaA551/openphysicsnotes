# GA4 verification, 2026-11-09

- Correct local public measurement ID: G-K197CS7ZBG. `.env.local` remains ignored and is not committed.
- `node --test tests/*/*.test.mjs`: 30 passed, 0 failed (303646 ms).
- `node node_modules/typescript/bin/tsc --noEmit --incremental false`: passed.
- `git diff --check`: passed.
- Isolated `NEXT_PUBLIC_GA_ID=G-K197CS7ZBG npm run build:static`: passed, 245/245 routes.
- Mocked isolated Chromium: one loader/config across initial, internal link, query push/replace, back and forward; passed.
- Actual gtag with intercepted collection: cumulative pageview counts 1, 2, 3, 4 for initial, internal link, back, forward. Every hit targeted G-K197CS7ZBG. No network failures. All collection requests were intercepted, so these checks sent no hits to GA4.

The tests use a new Chrome profile, not the user's browser. Source behavior is deliberately minimal: one default gtag config, no manual route tracker. This depends on the stream's Enhanced Measurement history tracking remaining enabled. GA4 Realtime visibility and production delivery are separate post-deployment checks, not claimed by the local tests.
