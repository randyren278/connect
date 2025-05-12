// lib/groupFactory.ts
import { seeds, Difficulty } from './seedThemes';
import { getSynonyms } from './seedThemes';

type Group = { 
  title: string; 
  words: string[]; 
  color: string 
};

const palette = {
  easy: 'bg-yellow-300',
  medium: 'bg-green-300',
  hard: 'bg-blue-300',
  extreme: 'bg-purple-300',
} as const;

const inMemoryCache: Record<string, Group | undefined> = {};

/**
 * Verify that words are truly relevant to the theme
 */
function validateWordSet(words: string[], theme: string): boolean {
  // Basic validation - ensure we have 4 words
  if (words.length !== 4) return false;
  
  // Ensure no duplicates
  const uniqueWords = new Set(words);
  if (uniqueWords.size !== 4) return false;
  
  // Ensure no ultra-short words
  if (words.some(word => word.length <= 2)) return false;
  
  return true;
}

/**
 * Build (or return cached) 4-word group for a difficulty
 */
export async function buildGroup(diff: Difficulty): Promise<Group> {
  // 1. Pick a random seed theme word/phrase
  const theme = seeds[diff][Math.floor(Math.random() * seeds[diff].length)];
  
  // 2. Use it as cache key
  const cacheKey = `${diff}:${theme}`;
  if (inMemoryCache[cacheKey]) return inMemoryCache[cacheKey]!;
  
  // 3. Try to get words for this theme, with retries
  let candidateWords: string[] = [];
  let themeToTry = theme;
  let attemptsLeft = 5; // Try a few times with different parameters
  
  while (attemptsLeft > 0 && themeToTry && !validateWordSet(candidateWords, themeToTry)) {
    candidateWords = await getSynonyms(themeToTry);
    
    // If we get less than 4 words, try with a modified theme
    if (candidateWords.length < 4) {
      // Try variations of the theme to get better results
      if (attemptsLeft % 2 === 0) {
        themeToTry = `${theme} examples` as typeof theme;
      } else {
        themeToTry = `common ${theme}` as typeof theme;
      }
    }
    
    // Ensure we have exactly 4 words
    candidateWords = [...new Set(candidateWords)].slice(0, 4);
    attemptsLeft--;
  }
  
  // If we still don't have 4 words, throw an error
  if (candidateWords.length < 4) {
    throw new Error(`Not enough words for ${theme}`);
  }
  
  // 4. Freeze & cache it
  const group: Group = {
    title: (theme ?? 'UNKNOWN THEME').toUpperCase(),
    words: candidateWords,
    color: palette[diff],
  };
  
  inMemoryCache[cacheKey] = group;
  return group;
}