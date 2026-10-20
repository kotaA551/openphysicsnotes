// Coordinates measured downwards from the suspension cusp. q is HALF the
// generating-circle parameter, not the ordinary pendulum angle.
export const cheek = (q, a = 1) => [a * (2 * q - Math.sin(2 * q)), a * (1 - Math.cos(2 * q))];
export const bob = (q, a = 1) => [a * (2 * q + Math.sin(2 * q)), a * (3 + Math.cos(2 * q))];
export const wrappedLength = (q, a = 1) => 4 * a * (1 - Math.cos(q));
export const freeLength = (q, a = 1) => 4 * a * Math.cos(q);
export const signedArc = (q, a = 1) => 4 * a * Math.sin(q);
