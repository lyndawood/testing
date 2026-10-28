/**
 * Clamps a value between a minimum and maximum bound.
 * @param {number} value - The value to clamp
 * @param {number} min - The minimum bound (inclusive)
 * @param {number} max - The maximum bound (inclusive)
 * @returns {number} The clamped value
 */
function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

module.exports = { clamp };
