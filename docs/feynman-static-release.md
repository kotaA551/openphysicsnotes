# Feynman diagram and static release

Section 8.3.4 in all ten editions includes the real scalar phi-four tree-level
2-to-2 contact diagram. Four undirected scalar legs meet at one vertex, with
factor -i lambda for L_int = -lambda phi^4/4!. Incoming momenta p1,p2 and outgoing
p3,p4 obey momentum conservation. There is no internal line or loop. This is
an amplitude diagram, not a spacetime trajectory. No original prose or headings
were replaced. The existing QED note is separate from this scalar example.

Physics reference: David Tong, Quantum Field Theory, Interacting Fields,
sections 3 and 3.5: https://www.damtp.cam.ac.uk/user/tong/qft/three.pdf

The SVG uses the existing study-figure styling with localized alt text/captions.
Its explicit light backing preserves contrast in dark mode, and the existing
responsive image rules constrain its width.

Production configuration selects Vercel's generic static output with `out`
as the output directory. `npm run build:static` explicitly enables export and
removes comparison route filters and custom output-directory overrides.
This produces HTML, App Router navigation text payloads, JavaScript and assets;
it does not remove hydration or the App Router payload. Deployment and live
static delivery must still be verified separately from a successful local build.

`npm run dev` remains normal Next development. It is not a transfer measurement.
HTML-only math retains the previously accepted loss of MathML accessibility.
