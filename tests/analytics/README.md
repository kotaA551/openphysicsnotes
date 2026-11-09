# GA4 regression checks

The application initializes GA4 once. The GA4 web stream must keep Enhanced Measurement > Page views > Page changes based on browser history events enabled. Do not restore a second route-change config/event tracker while that setting is enabled.

Set `NEXT_PUBLIC_GA_ID` in the production build environment, then rebuild. It is a public build-time identifier, not a runtime setting. Local `.env.local` files must not be committed.

- `node --test tests/analytics/*.test.mjs`: absent-ID behavior and exactly one loader/config, with no manual route tracker.
- `node tests/analytics/browser-qa.mjs`: isolated headless Chrome against `out`, Google traffic mocked, navigation command counts verified.
- Set `GA_QA_OUT` to another static output directory, or `GA_QA_URL` to an explicitly authorized deployed site.
- Set `GA_QA_REAL=1` to load actual gtag/stream settings while intercepting collection requests; verifies exactly one pageview for initial load, internal link, back and forward without sending the hits.
- Set `GA_QA_LIVE=1` only for an authorized production smoke check. This sends those four pageviews to GA4. A sent request is not proof it appears in the property's reports; verify Realtime separately.

The browser checks use a temporary profile and never operate the user's signed-in browser. Google initialization/collection failures remain failures, not simulated successes. Consent and privacy policy choices are outside this tracking repair; there is currently no consent gate in this integration. Default GA page locations include query strings, so URLs must not contain personal or sensitive information.
