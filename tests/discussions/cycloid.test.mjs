import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';
import { cheek, bob, wrappedLength, freeLength, signedArc } from '../../scripts/cycloid-geometry.mjs';
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} != ${b}`);
test('cycloidal construction: constant string length, tangent free segment, evolute, quadratic height', () => {
  for (let q = -.99 * Math.PI / 2; q < Math.PI / 2; q += .015) {
    const a = 65, c = cheek(q, a), b = bob(q, a), dx = b[0]-c[0], dy = b[1]-c[1];
    near(Math.hypot(dx,dy), freeLength(q,a));
    near(wrappedLength(q,a) + freeLength(q,a), 4*a);
    near(dx * Math.cos(q) - dy * Math.sin(q), 0);
    near(4*a - b[1], signedArc(q,a)**2/(8*a));
    // The curvature center of the bob curve is exactly the cheek contact point.
    const xp=2*a*(1+Math.cos(2*q)), yp=-2*a*Math.sin(2*q), xpp=-4*a*Math.sin(2*q), ypp=-4*a*Math.cos(2*q);
    const scale=(xp*xp+yp*yp)/(xp*ypp-yp*xpp);
    near(b[0]-yp*scale,c[0]); near(b[1]+xp*scale,c[1]);
  }
});
test('generated SVGs are valid, contain no embedded code and the contact/free endpoints agree', () => {
  for (const file of ['pendulum-circular-comparison.svg','pendulum-cycloidal-cheeks.svg']) {
    const dom = new JSDOM(fs.readFileSync(`public/images/diagrams/${file}`,'utf8'), { contentType: 'image/svg+xml' });
    assert.equal(dom.window.document.querySelectorAll('script,foreignObject,image').length, 0);
    assert.equal(dom.window.document.documentElement.getAttribute('viewBox'), '0 0 450 390');
    if (file.includes('cheeks')) {
      const wrapped=dom.window.document.querySelector('[data-part="wrapped"]').getAttribute('d');
      const free=dom.window.document.querySelector('[data-part="free"]').getAttribute('d');
      assert.equal(wrapped.split(' L').at(-1),free.split(' L')[0].slice(1));
    }
    dom.window.close();
  }
});
