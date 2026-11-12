# Embedded Space Map

HomeContent places the map below TopicIndex on all ten language homepages. The map starts loading automatically when its window is within 400 pixels above/below the viewport. No launch click is needed. Until the child signals successful application initialization, a loading placeholder covers the frame. The iframe remains mounted when scrolling away or changing fullscreen, preserving selection, view and time. Native fullscreen has a CSS full-window fallback; Escape works inside the frame too.

Only same-origin messages from the actual iframe are accepted. No initialization signal within 30 seconds, an iframe load error, or a child runtime error shows a Retry control instead of an endless spinner. Retry creates a new iframe and deliberately resets the map. A late successful initialization can clear the timeout warning. The readiness signal means application initialization succeeded, not that every texture finished downloading; texture errors retain the map's own warning.

The map skips rendering/model updates while outside the visible viewport or while the tab is hidden. Prefetch proximity and rendering visibility are separate: it can initialize just below the screen without continuously drawing there. A browser without IntersectionObserver loads immediately rather than failing.

Tradeoff: users who scroll near the map download approximately 5.6 MiB of uncompressed static assets (10 texture JPEGs plus code, mostly images) even without interacting. Actual transfer varies with compression and cache. Users who never approach it do not request those assets. A fast scroll or slow connection can still expose the loading placeholder; the 400px lead is not a guarantee of instant rendering. Fullscreen and later scrolling do not intentionally reload the assets.

Source stays separate at ../space-map. Run `node scripts/import-space-map.mjs ../space-map` to refresh generated public/space-map from tested source. Normal OPN builds need neither that sibling nor extra packages. Credits and SOURCES.md are retained. The source Space Map is not modified. Existing Cloudflare Pages static deployment can include these assets; no separate domain or Worker is needed. No publication occurs during import.

Checks: node --test tests/space-map.test.mjs; npx tsc --noEmit --incremental false; node tests/space-map-browser.mjs with local OPN at 127.0.0.1:3112. The browser check uses separate headless Chrome and mobile viewport emulation. Actual touchscreen and native fullscreen require device verification.
