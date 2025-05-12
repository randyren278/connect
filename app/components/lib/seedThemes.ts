// lib/seedThemes.ts
import { shuffleArray } from '@/lib/shuffle';

export const seeds = {
  easy: [
    'colors',
    'days',
    'planets',
    'card suits',
    'Canadian provinces',
    'Disney princesses',
    'primary school subjects',
    'Beatles members',
    // …
  ],
  medium: [
    'types of energy',
    'classical elements',
    'word homophones',
    'famous physicists',
    'computer ports',
    'HTTP status codes',
    'big-O notations',
    // …
  ],
  hard: [
    'Greek letters used in math',
    'Nobel prize categories',
    'SQL isolation levels',
    'Shakespeare tragedies',
    'chemical functional groups',
    'common cipher names',
    // …
  ],
  extreme: [
    'pangrams',
    'rare chess openings',
    'obsolete SI units',
    'type-I supernova precursors',
    // …
  ],
} as const;

export type Difficulty = keyof typeof seeds;

// ——— Curated lists as before ———
const CURATED_SETS: Record<string, string[]> = {
  // Easy
  'COLORS': [/* … */],
  'DAYS': [/* … */],
  /* etc. */
  // Extreme
  'PANGRAMS': [/* … */],
  'RARE CHESS OPENINGS': [/* … */],
  'OBSOLETE SI UNITS': [/* … */],
  'TYPE-I SUPERNOVA PRECURSORS': [/* … */],
};

// If a theme tends to return garbage via rel_syn, override here:
const API_OVERRIDES: Record<string, string> = {
  // key must be normalized form:
  'TYPE-I SUPERNOVA PRECURSORS': 'supernova precursor',
  // add more overrides as needed…
};

/** Normalize seed → lookup key */
function normalizeKey(keyword: string): string {
  return keyword
    .trim()
    .toUpperCase()
    // normalize any unicode dashes to simple hyphen-minus
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015]/g, '-')
    // normalize curly apostrophes
    .replace(/[’‘]/g, "'")
    // collapse whitespace
    .replace(/\s+/g, ' ');
}

/** Build the best Datamuse query for a theme */
function buildApiQuery(keyword: string): string {
  const key = normalizeKey(keyword);
  return API_OVERRIDES[key] ?? keyword;
}

/**
 * Get 4 words for a theme:
 *  • Use curated set if available
 *  • Else try rel_syn (true synonyms), filter to single‐token uppercase
 *  • If <4 results, fallback to ml (broader “means like”)
 *  • If still <4, emergency generic fallback
 */
export async function getSynonyms(keyword: string): Promise<string[]> {
  const key = normalizeKey(keyword);

  // 1) curated?
  if (CURATED_SETS[key]) {
    const all = CURATED_SETS[key]!;
    return shuffleArray(all).slice(0, 4);
  }

  // 2) else hit Datamuse
  const query = buildApiQuery(keyword);
  try {
    // first: true synonyms
    let res = await fetch(
      `https://api.datamuse.com/words?rel_syn=${encodeURIComponent(query)}&max=20`
    );
    if (!res.ok) throw new Error('Datamuse rel_syn failure');
    let candidates: string[] = (await res.json())
      .map((w: { word: string }) => w.word.toUpperCase())
      .filter((w: string) => /^[A-Z0-9()]+$/.test(w))     // single token, alphanumeric or () 
      .filter((w: string) => w.length >= 3 && w.length <= 15);

    // if not enough, broaden to "means like"
    if (candidates.length < 4) {
      res = await fetch(
        `https://api.datamuse.com/words?ml=${encodeURIComponent(query)}&max=20`
      );
      if (res.ok) {
        candidates = candidates
          .concat(
            (await res.json())
              .map((w: { word: string }) => w.word.toUpperCase())
              .filter((w: string) => /^[A-Z0-9()]+$/.test(w))
              .filter((w: string) => w.length >= 3 && w.length <= 15)
          );
      }
    }

    if (candidates.length >= 4) {
      return shuffleArray([...new Set(candidates)]).slice(0, 4);
    }
  } catch (e) {
    console.error('getSynonyms error:', e);
  }

  // 3) emergency fallback
  return ['EXAMPLE', 'INSTANCE', 'TYPE', 'KIND'].map(w => `${w} OF ${query.toUpperCase()}`).slice(0, 4);
}
