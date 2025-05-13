// lib/groupFactory.ts (or wherever this file is)
import { seeds, getSynonyms, Difficulty } from './seedThemes';


type Group = {
  title: string;
  words: string[];
  color: string;
};

const palette: Record<Difficulty, string> = {
  easy: 'bg-yellow-300',
  medium: 'bg-green-300',
  hard: 'bg-blue-300',
  extreme: 'bg-purple-300',
};


/* simple in‑memory cache so we don’t regenerate the same theme repeatedly */
const cache: Record<string, Group | undefined> = {};

/* -------------------------------------------------------------- *
 *  Basic sanity checks for a 4‑word set                           *
 * -------------------------------------------------------------- */
function isValid(words: string[]): boolean {
  return (
    words.length === 4 &&
    new Set(words).size === 4 &&            // no duplicates
    words.every(w => w.length > 2)          // no ultra‑short tokens
  );
}

/* -------------------------------------------------------------- *
 *  Build (or return cached) 4‑word group for a given difficulty   *
 * -------------------------------------------------------------- */
export async function buildGroup(diff: Difficulty): Promise<Group> {
  const themes = seeds[diff];                  // list of titles for this bucket
  let attempts = 0;

  while (attempts < themes.length) {
    const theme = themes[Math.floor(Math.random() * themes.length)];
    const cacheKey = `${diff}:${theme}`;
    if (cache[cacheKey]) return cache[cacheKey]!;

    const words = await getSynonyms(theme);

    if (isValid(words)) {
      const group: Group = {
        title: theme.toUpperCase(),
        words,
        color: palette[diff],
      };
      cache[cacheKey] = group;
      return group;
    }

    attempts++;
  }

  /* If we somehow failed to find any valid theme (shouldn’t happen) */
  throw new Error(`Unable to build a valid ${diff} group after ${attempts} tries`);
}
