/**
 * Original, language-neutral diagrams for the eighth Curiosity.
 * Run from the repository root: node scripts/generate-groups-diagrams.mjs
 * All geometry is generated locally; no fonts, scripts, or images are fetched.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const out = path.resolve('public/images/diagrams');
await fs.mkdir(out, { recursive: true });
const C = { ink: '#14283f', muted: '#52647b', line: '#a9b8c9', blue: '#155fc0', orange: '#b54c13', purple: '#7543ad', green: '#087760', bg: '#f8fafc' };
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const txt = (x, y, s, size = 23, color = C.ink, anchor = 'middle', extra = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}" ${extra}>${esc(s)}</text>`;
// Only pass trusted, author-written tspan markup to this helper.
const mathText = (x, y, s, size = 23, color = C.ink) => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="middle">${s}</text>`;
const line = (x1, y1, x2, y2, color = C.line, width = 2, extra = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" ${extra}/>`;
const arrow = (x1, y1, x2, y2, color = 'blue', width = 3, extra = '') => line(x1, y1, x2, y2, C[color], width, `marker-end="url(#${color}-arrow)" ${extra}`);
const rect = (x, y, w, h, fill = '#fff', stroke = C.line, rx = 12) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
const dot = (x, y, r = 5, fill = C.ink) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const curve = (d, color = 'blue', width = 3, extra = '') => `<path d="${d}" fill="none" stroke="${C[color]}" stroke-width="${width}" ${extra}/>`;
const point = (cx, cy, r, a) => [cx + r * Math.cos(a), cy - r * Math.sin(a)];
const polyline = points => points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(3)},${y.toFixed(3)}`).join(' ');
const arc = (cx, cy, r, a, b, color = 'blue', width = 3, withArrow = false) => curve(polyline(Array.from({ length: 41 }, (_, i) => point(cx, cy, r, a + (b - a) * i / 40))), color, width, withArrow ? `marker-end="url(#${color}-arrow)"` : '');

async function save(name, title, description, body, height = 500, width = 840) {
  const id = name.replaceAll('-', '_');
  const markers = ['blue', 'orange', 'purple', 'green', 'muted'].map(k => `<marker id="${k}-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9Z" fill="${C[k]}"/></marker>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${id}_title ${id}_desc">
<title id="${id}_title">${esc(title)}</title>
<desc id="${id}_desc">${esc(description)}</desc>
<defs>${markers}</defs>
<rect width="${width}" height="${height}" rx="18" fill="${C.bg}"/>
<g font-family="Arial, DejaVu Sans, sans-serif" stroke-linecap="round" stroke-linejoin="round" xml:space="preserve">${body}</g>
</svg>\n`;
  await fs.writeFile(path.join(out, `${name}.svg`), svg);
  console.log(`${name}.svg (${width} × ${height})`);
}

// D3: slot 1 is the top, slot 2 lower right, slot 3 lower left.
// r=(123) is a clockwise 120° rotation; s=(23) reflects in the vertical axis.
// State arrays list the material vertex labels occupying those fixed slots.
function triangle(cx, cy, labels) {
  const vertices = [[cx, cy - 56], [cx + 48.4974, cy + 28], [cx - 48.4974, cy + 28]];
  const colors = [C.blue, C.orange, C.purple];
  return `<path d="${polyline([...vertices, vertices[0]])}" fill="#e9eff8" stroke="${C.line}" stroke-width="2"/>` +
    vertices.map(([x, y], i) => dot(x, y, 16, colors[labels[i] - 1]) + txt(x, y + 6, labels[i], 20, '#fff')).join('');
}
await save('groups-triangle-composition', 'Noncommuting symmetries of an equilateral triangle',
  'Material vertices initially occupy slots 1 at the top, 2 at the lower right, and 3 at the lower left. The clockwise rotation r=(123) followed by the reflection s=(23) gives sr=(13). Reversing the order gives rs=(12). Products act on the rightmost factor first. Colored vertex labels are carried by each transformation.',
  txt(420, 39, 'r = (123)       s = (23)', 27) +
  triangle(105, 144, [1, 2, 3]) + triangle(365, 144, [3, 1, 2]) + triangle(625, 144, [3, 2, 1]) +
  arrow(177, 137, 285, 137) + txt(230, 114, 'r', 27, C.blue) +
  arrow(437, 137, 545, 137, 'orange') + txt(490, 114, 's', 27, C.orange) +
  txt(105, 210, 'e') + txt(365, 210, 'r') + txt(625, 210, 'sr = (13)', 23) +
  triangle(105, 313, [1, 2, 3]) + triangle(365, 313, [1, 3, 2]) + triangle(625, 313, [2, 1, 3]) +
  arrow(177, 306, 285, 306, 'orange') + txt(230, 283, 's', 27, C.orange) +
  arrow(437, 306, 545, 306) + txt(490, 283, 'r', 27, C.blue) +
  txt(105, 379, 'e') + txt(365, 379, 's') + txt(625, 379, 'rs = (12)', 23) +
  rect(72, 413, 696, 61, '#fff') + txt(420, 452, '(sr)(v) = s(r(v))       sr ≠ rs', 27), 500);

const theta = Math.PI * 0.3;
function rotationPanel(cx, cy, complex) {
  const r = 104, p = point(cx, cy, r, theta);
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.line}" stroke-width="2"/>` +
    arrow(cx - 137, cy, cx + 148, cy, 'muted', 1.8) + arrow(cx, cy + 125, cx, cy - 133, 'muted', 1.8) +
    txt(cx + 150, cy + 28, complex ? 'Re z' : 'x', 20, C.muted) + txt(cx - 14, cy - 126, complex ? 'Im z' : 'y', 20, C.muted, 'end') +
    arrow(cx, cy, cx + r, cy, 'orange', 4) + arrow(cx, cy, p[0], p[1], 'blue', 4) +
    arc(cx, cy, 43, 0, theta, 'blue', 2.5, true) + txt(cx + 53, cy - 23, 'θ', 22, C.blue) +
    dot(cx, cy, 4) + dot(p[0], p[1], 5, C.blue) +
    txt(cx + r - 4, cy + 32, complex ? '1' : '(1, 0)', 21, C.orange) +
    txt(cx + (complex ? 55 : 95), cy - 116, complex ? 'eⁱᶿ' : '(cos θ, sin θ)', 23, C.blue);
}
await save('groups-rotation-phase', 'A planar rotation and a complex phase describe the same transformation',
  'The same counterclockwise angle theta rotates the real unit vector (1,0) to (cos theta,sin theta) and multiplies the complex number 1 by exp(i theta). Identifying (x,y) with x+iy is the Lie group isomorphism SO(2) to U(1); both angles are periodic by 2 pi.',
  txt(220, 44, 'SO(2)', 31, C.blue) + txt(620, 44, 'U(1)', 31, C.blue) +
  rotationPanel(220, 240, false) + rotationPanel(620, 240, true) +
  txt(420, 239, '↔', 36, C.muted) +
  rect(87, 396, 666, 78, '#fff') + txt(420, 427, 'R(θ) ↔ exp(iθ)       (x, y) ↔ x + iy', 24) + txt(420, 459, 'θ ∼ θ + 2π', 23, C.muted));

await save('groups-tangent-exponential', 'The exponential maps a tangent algebra to the circle group',
  'On the left, the Lie algebra u(1)=iR is a straight real vector space, identified with the vertical tangent line at the identity 1 of the circle on the right. Two vectors i pi/2 and i 5pi/2 have the same image i under the exponential. The exponential is locally invertible at zero but is not globally one to one. The vertical scale on the algebra axis is linear.',
  txt(420, 41, 'exp : u(1) → U(1)', 29) +
  arrow(180, 356, 180, 66, 'muted', 2) + dot(180, 356, 5) +
  txt(180, 399, 'u(1) = iℝ', 25) + txt(158, 364, '0', 22, C.muted, 'end') +
  dot(180, 302, 7, C.blue) + txt(158, 310, 'i(π/2)', 23, C.blue, 'end') +
  dot(180, 86, 7, C.purple) + txt(158, 94, 'i(5π/2)', 23, C.purple, 'end') +
  `<circle cx="569" cy="243" r="112" fill="none" stroke="${C.blue}" stroke-width="3"/>` +
  line(438, 243, 730, 243) + line(569, 370, 569, 111) +
  dot(681, 243, 6, C.orange) + txt(699, 274, '1', 24, C.orange) +
  line(681, 334, 681, 151, C.orange, 2, 'stroke-dasharray="5 5"') + arrow(681, 243, 681, 188, 'orange') +
  txt(706, 157, 'T₁U(1)', 22, C.orange) +
  dot(569, 131, 8, C.blue) + txt(591, 126, 'i', 25, C.blue) +
  curve('M192 302C333 302 354 152 552 133', 'blue', 3, 'marker-end="url(#blue-arrow)"') +
  curve('M192 86C335 53 440 76 552 125', 'purple', 3, 'marker-end="url(#purple-arrow)"') +
  txt(364, 116, 'exp', 23, C.purple) + txt(365, 253, 'exp', 23, C.blue) +
  txt(569, 399, 'U(1)', 25) +
  rect(66, 425, 708, 53, '#fff') + txt(420, 460, 'exp(iπ/2) = exp(i5π/2) = i', 26));

await save('groups-su2-cover', 'Two SU(2) lifts for every spatial rotation',
  'This is a parameter track, not a geometric picture of the three dimensional manifold SU(2). Along U(theta)=exp(-i theta sigma_3/2), the states at theta=0, pi, 2pi, 3pi, 4pi are I, -i sigma_3, -I, i sigma_3, I. Their images in SO(3) are I_3, R_z(pi), I_3, R_z(pi), I_3. Thus U and -U project to the same rotation and a spinor returns after 4pi.',
  txt(420, 38, 'U(θ) = exp(−iθσ₃/2)', 29, C.blue) +
  txt(420, 76, 'p(U(θ)) = Rz(θ)', 25, C.green) +
  arrow(95, 160, 765, 160, 'blue', 3) + arrow(95, 327, 765, 327, 'green', 3) +
  [100, 260, 420, 580, 740].map((x, i) => {
    const thetaLabels = ['0', 'π', '2π', '3π', '4π'];
    const uLabels = ['I', '−iσ₃', '−I', 'iσ₃', 'I'];
    const rLabels = ['I₃', 'Rz(π)', 'I₃', 'Rz(π)', 'I₃'];
    return dot(x, 160, 8, C.blue) + txt(x, 135, uLabels[i], 24, C.blue) +
      arrow(x, 188, x, 281, 'muted', 2, 'stroke-dasharray="5 5"') +
      txt(x + 15, 245, 'p', 20, C.muted) + dot(x, 327, 8, C.green) +
      txt(x, 309, rLabels[i], 23, C.green) + txt(x, 370, thetaLabels[i], 22, C.muted);
  }).join('') +
  txt(788, 373, 'θ', 24, C.muted) +
  rect(61, 413, 718, 65, '#fff') + txt(420, 453, 'U(θ + 2π) = −U(θ)       p(U) = p(−U)', 26));

await save('groups-representations', 'Direct sum and tensor product representations',
  'The direct sum V plus W stores one vector from V and one from W as separate blocks. The tensor product V tensor W has basis e_i tensor f_j for every pair of basis vectors. Both have dimension four when each factor has dimension two, but the group acts by a block diagonal matrix in the first case and a Kronecker product in the second. For two SU(2) doublets the tensor product splits into a symmetric triplet and an antisymmetric singlet, shown with normalized mixed states.',
  txt(210, 41, 'V ⊕ W', 30, C.blue) + txt(630, 41, 'V ⊗ W', 30, C.purple) +
  rect(74, 64, 272, 72, '#e7effc', C.blue) + txt(210, 109, '(v₁, v₂)', 26, C.blue) +
  rect(74, 147, 272, 72, '#f5eaff', C.purple) + txt(210, 192, '(w₁, w₂)', 26, C.purple) +
  rect(474, 64, 150, 72, '#e7effc', C.blue) + txt(549, 108, 'e₁ ⊗ f₁', 23) +
  rect(635, 64, 150, 72, '#edf6f2', C.green) + txt(710, 108, 'e₁ ⊗ f₂', 23) +
  rect(474, 147, 150, 72, '#fff0e8', C.orange) + txt(549, 191, 'e₂ ⊗ f₁', 23) +
  rect(635, 147, 150, 72, '#f5eaff', C.purple) + txt(710, 191, 'e₂ ⊗ f₂', 23) +
  txt(210, 257, 'dim(V ⊕ W) = 2 + 2 = 4', 23) + txt(630, 257, 'dim(V ⊗ W) = 2 × 2 = 4', 23) +
  txt(210, 295, 'ρV(g) ⊕ ρW(g)', 24, C.blue) + txt(630, 295, 'ρV(g) ⊗ ρW(g)', 24, C.purple) +
  line(51, 322, 790, 322) + txt(420, 357, 'SU(2) :  2 ⊗ 2 = 3 ⊕ 1', 27) +
  rect(34, 379, 496, 88, '#e7effc', C.blue) + txt(282, 408, '3', 23, C.blue) +
  txt(282, 444, '↑↑     (↑↓ + ↓↑)/√2     ↓↓', 23) +
  rect(550, 379, 256, 88, '#f5eaff', C.purple) + txt(678, 408, '1', 23, C.purple) +
  txt(678, 444, '(↑↓ − ↓↑)/√2', 22));

await save('groups-connection-curvature', 'Parallel transport connects fibers; curvature appears around a small loop',
  'Left: points x and y lie in the base space M; their vector spaces V_x and V_y are shown above them and linked to the base by dashed lines. A connection specifies the transport P_gamma from a vector v at x to P_gamma v at y. Right: transport in the positive mu, positive nu, negative mu, negative nu directions around a small rectangle returns to the original fiber and acts by U_square. The inset in that same fiber compares v with U_square v. For D_mu=partial_mu-igA_mu the leading correction is +igF_mu_nu delta x^mu delta x^nu, with fixed distinct mu and nu and no summation. A change of frame alone is not curvature. No metric distance or universal rotation angle in a general gauge fiber is implied.',
  txt(212, 39, 'Pγ : Vx → Vy', 28, C.blue) + txt(630, 39, 'U□ : Vx → Vx', 28, C.purple) +
  line(420, 66, 420, 409, C.line, 1.5) +
  `<path d="M43 323L306 323L372 385L109 385Z" fill="#e9eff8" stroke="${C.line}" stroke-width="1.5"/>` +
  txt(350, 413, 'M', 23, C.muted) + dot(117, 351) + dot(304, 351) +
  txt(117, 384, 'x', 22) + txt(304, 384, 'y', 22) +
  curve('M122 347Q210 295 297 347', 'muted', 2, 'marker-end="url(#muted-arrow)"') + txt(211, 309, 'γ', 23, C.muted) +
  line(117, 347, 117, 182, C.line, 2, 'stroke-dasharray="5 5"') + line(304, 347, 304, 182, C.line, 2, 'stroke-dasharray="5 5"') +
  rect(47, 112, 140, 107, '#fff', C.blue) + rect(234, 112, 140, 107, '#fff', C.green) +
  txt(70, 137, 'Vx', 20, C.blue, 'start') + txt(257, 137, 'Vy', 20, C.green, 'start') +
  arrow(87, 195, 148, 154, 'blue', 3) + txt(149, 196, 'v', 22, C.blue) +
  arrow(270, 195, 327, 157, 'green', 3) + txt(319, 204, 'Pγv', 20, C.green) +
  curve('M128 99Q211 57 293 99', 'blue', 3, 'marker-end="url(#blue-arrow)"') + txt(210, 105, 'Pγ', 22, C.blue) +
  rect(451, 67, 179, 123, '#fff', C.purple) + txt(475, 96, 'Vx', 21, C.purple) +
  arrow(479, 166, 578, 164, 'blue', 3) + txt(594, 171, 'v', 21, C.blue) +
  arrow(479, 166, 554, 114, 'purple', 3) + txt(592, 112, 'U□v', 21, C.purple) +
  `<path d="M463 226L727 226L793 387L463 387Z" fill="#edf1f8" stroke="${C.line}" stroke-width="1.5"/>` +
  curve('M479 191L448 211L448 329L502 353', 'muted', 1.5, 'stroke-dasharray="5 5"') +
  arrow(507, 355, 731, 355, 'purple', 3) + arrow(739, 347, 739, 251, 'purple', 3) +
  arrow(731, 243, 515, 243, 'purple', 3) + arrow(507, 251, 507, 347, 'purple', 3) +
  dot(507, 355, 6, C.ink) + txt(491, 378, 'x', 21) +
  mathText(623, 382, 'δx<tspan baseline-shift="super" font-size="16">μ</tspan>', 22, C.purple) +
  mathText(771, 310, 'δx<tspan baseline-shift="super" font-size="16">ν</tspan>', 22, C.purple) +
  txt(624, 305, 'U□ = P∂□', 24, C.purple) + txt(779, 417, 'M', 23, C.muted) +
  rect(51, 439, 738, 43, '#fff') + mathText(420, 468, 'U□ = I + igF<tspan baseline-shift="sub" font-size="17">μν</tspan><tspan> δx</tspan><tspan baseline-shift="super" font-size="17">μ</tspan><tspan> δx</tspan><tspan baseline-shift="super" font-size="17">ν</tspan><tspan> + ⋯</tspan>', 25));

await save('groups-standard-model', 'Standard Model gauge fields and electroweak mixing',
  'Before electroweak symmetry breaking there are eight gluon gauge fields for SU(3)_c, three W fields for SU(2)_L, and one B field for U(1)_Y: twelve generators in total. A nonzero Higgs expectation value leaves color and electromagnetism unbroken. W1 and W2 combine into charged W plus and W minus. W3 and B mix into the photon A and the Z boson. With Q=T3+Y, tan(theta_W)=g prime/g; A=sin(theta_W)W3+cos(theta_W)B and Z=cos(theta_W)W3-sin(theta_W)B. This is a field-basis diagram, not a derivation of the Higgs mechanism.',
  txt(420, 33, '8 + 3 + 1 = 12', 26, C.muted) +
  rect(29, 53, 232, 96, '#edf6f2', C.green) + txt(145, 87, 'SU(3)c', 29, C.green) + txt(145, 126, 'Gμᵃ   a = 1,…,8', 23) +
  rect(280, 53, 310, 96, '#e7effc', C.blue) + txt(435, 87, 'SU(2)L', 29, C.blue) + txt(435, 126, 'Wμ¹    Wμ²    Wμ³', 23) +
  rect(609, 53, 202, 96, '#f5eaff', C.purple) + txt(710, 87, 'U(1)Y', 29, C.purple) + txt(710, 126, 'Bμ', 25) +
  arrow(145, 158, 145, 300, 'green') +
  arrow(380, 158, 380, 300, 'blue') + txt(394, 211, 'W¹, W²', 22, C.blue, 'start') +
  curve('M540 158L540 209L620 259', 'blue', 3, 'marker-end="url(#blue-arrow)"') +
  curve('M710 158L710 209L638 259', 'purple', 3, 'marker-end="url(#purple-arrow)"') +
  txt(531, 190, 'W³', 21, C.blue, 'end') + txt(722, 190, 'B', 21, C.purple, 'start') +
  rect(571, 256, 117, 45, '#fff', C.line) + txt(629, 286, 'θW', 23) +
  arrow(601, 306, 562, 329, 'orange') + arrow(659, 306, 705, 329, 'purple') +
  rect(41, 316, 208, 59, '#edf6f2', C.green) + txt(145, 354, 'G¹,…,G⁸', 25, C.green) +
  rect(290, 316, 178, 59, '#e7effc', C.blue) + txt(379, 354, 'W⁺, W⁻', 27, C.blue) +
  rect(508, 335, 98, 49, '#fff0e8', C.orange) + txt(557, 368, 'A', 27, C.orange) +
  rect(666, 335, 98, 49, '#f5eaff', C.purple) + txt(715, 368, 'Z', 27, C.purple) +
  txt(379, 410, 'W± = (W¹ ∓ iW²)/√2', 23, C.blue) +
  txt(420, 451, 'A = sW W³ + cW B       Z = cW W³ − sW B', 23) +
  txt(420, 486, 'sW = sin θW    cW = cos θW    tan θW = g′/g', 22, C.muted) +
  txt(420, 522, 'Q = T₃ + Y      ⟨H⟩ ≠ 0 : SU(3)c × U(1)em', 24), 545);
