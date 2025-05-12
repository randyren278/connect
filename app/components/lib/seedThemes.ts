// ❤ Keep this file short & hand‑curated.
// These are the “ideas” your generator will expand into 4‑word groups.

export const seeds = {
    easy: [
      'colors', 'days', 'planets', 'card suits', 'Canadian provinces',
      'Disney princesses', 'primary school subjects', 'Beatles members',
      // …
    ],
    medium: [
      'types of energy', 'classical elements', 'word homophones', 'famous physicists',
      'computer ports', 'HTTP status codes', 'big‑O notations',
      // …
    ],
    hard: [
      'Greek letters used in math', 'Nobel prize categories',
      'SQL isolation levels', 'Shakespeare tragedies',
      'chemical functional groups', 'common cipher names',
      // …
    ],
    extreme: [
      'pangrams', 'rare chess openings', 'obsolete SI units',
      'English words ending in –gry', 'Type‑I supernova precursors',
      // …
    ],
  } as const;
  
  export type Difficulty = keyof typeof seeds;
  