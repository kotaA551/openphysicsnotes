# Theme selection

The header appearance control is immediately before the language control. Its
three choices are system, Light and Dark. The control's accessible name and
heading follow all ten interface languages; the choice names stay as requested.

- system follows live OS appearance changes and clears the saved override.
- Light and Dark override the OS and are stored in localStorage under opn-theme.
- The root head script applies a saved override before body content is painted.
- CSS handles system appearance even if JavaScript or localStorage is unavailable.
- Escape, choosing an item, focus leaving, outside pointer actions and route changes
  close the theme list. Selection and Escape return focus to its summary button.
- Native named details keep the two preference lists mutually exclusive.
- Existing article, figure, search and navigation palettes use the shared Tailwind
  theme-dark variant in app/theme-variant.css. No packages were added.

## Verification

Run node --test tests/theme/*.test.mjs for the component, initialization and CSS
regressions, and npm run typecheck for TypeScript.

For real-browser checks, start Next on 127.0.0.1:3108 using an isolated build
folder, then run node tests/theme/browser-check.mjs. THEME_QA_URL and CHROME_PATH
can override the server URL and Chrome executable. The check uses a separate
headless Chrome profile and debugging port 9338; it does not use a personal
browser profile. Screenshots and that temporary profile remain in the printed
temporary directory. It covers explicit/OS appearance combinations, persistence,
keyboard dismissal and activation, menu exclusivity, nine widths from 320 to
1280 pixels, locale and article navigation, and JavaScript-disabled OS fallback.

## Static release verification (2026-11-09)

The static production export passed in an isolated Git worktree, including all
230 canonical pages, 200 article editions, ten search indexes and 78,608 math
expressions. All 28 regression tests and TypeScript checks passed. Real headless
Chromium tested the exported site across the appearance/OS matrix, persistence,
keyboard dismissal, menu exclusivity, nine viewport widths, locale/article
navigation and JavaScript-disabled system fallback. Desktop and mobile dark-mode
screenshots were visually reviewed. No runtime or hydration errors were reported.

The nine removed legacy image files have no active source references. Every
local image referenced by the generated pages was checked against the export.

The original checkout still contains the pre-existing broken
node_modules.link-backup junction. It and the installed dependencies were left
unchanged; the separate release worktree avoids scanning that backup link. Use
Node.js 22 or newer for the optional Chromium check, which uses global WebSocket.
