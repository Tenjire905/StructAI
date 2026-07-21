/**
 * Join spaces for fill-blank sentences (prefix + answer/___ + suffix).
 * Content and Playful shorteners sometimes drop edge whitespace — this restores
 * readable gaps in BOTH theme modes without inventing spaces before closing
 * punctuation.
 */

const FLUSH_RIGHT = /^[.,;:!?…)%\]}»”'’]/u;
const FLUSH_LEFT = /[([{„«"“'‘]$/u;

/** Returns a single space when left and right would otherwise glue awkwardly. */
export function fillBlankJoinGap(left: string, right: string): string {
  if (!left || !right) {
    return '';
  }

  if (/\s$/u.test(left) || /^\s/u.test(right)) {
    return '';
  }

  if (FLUSH_RIGHT.test(right) || FLUSH_LEFT.test(left)) {
    return '';
  }

  return ' ';
}

export function withFillBlankJoinSpaces(
  prefix: string,
  blank: string,
  suffix: string,
): { prefix: string; blank: string; suffix: string } {
  const lead = fillBlankJoinGap(prefix, blank);
  const trail = fillBlankJoinGap(blank, suffix);

  return {
    prefix: lead ? `${prefix}${lead}` : prefix,
    blank,
    suffix: trail ? `${trail}${suffix}` : suffix,
  };
}
