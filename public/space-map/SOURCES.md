# Sources and precision

## Physical geometry
All bodies are spheres of mean radius, consistently scaled in astronomical units (1 AU = 149,597,870.7 km). No planet enlargement or logarithmic distance compression. Earth mean radius: 6371.0084 km. Markers, labels, Earth surface pins and grid are UI overlays, not physical objects.

Planet radii: NASA/JPL Planetary Physical Parameters, https://ssd.jpl.nasa.gov/planets/phys_par.html (checked 2026-11-12). Sun nominal radius 695700 km; Moon mean radius 1737.4 km. Saturn's main-ring bands are stylized annuli, approximately 74500–140220 km from Saturn's center. Body flattening, detailed ring optical structure, clouds' time evolution and atmospheric scattering are not simulated.

## Position and orientation
Astronomy Engine 2.1.19, MIT, https://github.com/cosinekitty/astronomy . HelioVector planet/Sun vectors minus the Earth's vector at the same time; Moon uses GeoMoon. These are geometric simultaneous positions, not the apparent sky with light-time and aberration. Frame conversion uses true equator/equinox of date plus Greenwich apparent sidereal time. Earth-fixed conversion omits measured polar motion and Earth-orientation service corrections; do not call it precision ITRF. The interactive date input is restricted to 1900–2100. Orbital guides sample a future orbit with today's Earth origin held fixed; they are explanatory curves, not predicted geocentric tracks.

Planet pole directions come from RotationAxis. Earth geographic texture and grid align at 0 longitude with +X, 90 east with +Y, north with +Z. Other body map longitude/spin is illustrative, NOT an ephemeris-accurate view of which crater/longitude faces Earth. Mean-radius spherical geometry is not ellipsoidal geodesy. Decorative illumination includes fill light and has no inverse-square intensity or photometric calibration.

## Textures and licence
All 10 textures are from Solar System Scope / INOVE, https://www.solarsystemscope.com/textures/ , distributed under Creative Commons Attribution 4.0 International, https://creativecommons.org/licenses/by/4.0/ . Source pages and licence checked 2026-11-12. The downloaded 2K files are unmodified; the app applies mapping and lighting. The provider notes that colors are enhanced and some unmapped areas contain reconstructed/fictional terrain. Venus uses its atmosphere map, not a falsely visible surface.

Download URL pattern: https://www.solarsystemscope.com/textures/download/2k_NAME.jpg , NAME = earth_daymap, sun, moon, mercury, venus_atmosphere, mars, jupiter, saturn, uranus, neptune. Assets stored locally in public/textures. Attribution and licence are also linked in the UI.

Not intended for spacecraft navigation or precision observation planning.
