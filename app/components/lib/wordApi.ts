// lib/wordApi.ts
import { Difficulty } from './seedThemes';

// Curated word lists for common categories
const CURATED_SETS: Record<string, string[]> = {
  // Easy categories
  "COLORS": ["RED", "BLUE", "GREEN", "YELLOW", "PURPLE", "ORANGE", "BLACK", "WHITE", "PINK", "BROWN"],
  "DAYS": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
  "PLANETS": ["MERCURY", "VENUS", "EARTH", "MARS", "JUPITER", "SATURN", "URANUS", "NEPTUNE"],
  "CARD SUITS": ["HEARTS", "DIAMONDS", "CLUBS", "SPADES"],
  "CANADIAN PROVINCES": ["ONTARIO", "QUEBEC", "ALBERTA", "MANITOBA", "SASKATCHEWAN", "NOVA SCOTIA", "NUNAVUT", "YUKON"],
  "DISNEY PRINCESSES": ["CINDERELLA", "ARIEL", "BELLE", "JASMINE", "MULAN", "TIANA", "ELSA", "MOANA", "RAPUNZEL", "MERIDA"],
  "PRIMARY SCHOOL SUBJECTS": ["MATH", "SCIENCE", "READING", "WRITING", "HISTORY", "ART", "MUSIC", "GEOGRAPHY"],
  "BEATLES MEMBERS": ["JOHN", "PAUL", "GEORGE", "RINGO"],
  
  // Medium categories
  "TYPES OF ENERGY": ["KINETIC", "POTENTIAL", "THERMAL", "ELECTRICAL", "CHEMICAL", "NUCLEAR", "SOLAR", "SOUND"],
  "CLASSICAL ELEMENTS": ["FIRE", "WATER", "EARTH", "AIR", "ETHER", "WOOD", "METAL"],
  "WORD HOMOPHONES": ["THERE", "THEIR", "THEY'RE", "TO", "TOO", "TWO", "HEAR", "HERE", "KNOW", "NO"],
  "FAMOUS PHYSICISTS": ["EINSTEIN", "NEWTON", "FEYNMAN", "HAWKING", "BOHR", "CURIE", "TESLA", "PLANCK"],
  "COMPUTER PORTS": ["USB", "HDMI", "ETHERNET", "THUNDERBOLT", "VGA", "DISPLAY", "AUDIO", "SERIAL"],
  "HTTP STATUS CODES": ["200", "301", "404", "500", "403", "418", "201", "429"],
  "BIG-O NOTATIONS": ["O(1)", "O(N)", "O(LOG N)", "O(N²)", "O(N LOG N)", "O(2ⁿ)"],
  
  // Hard categories
  "GREEK LETTERS USED IN MATH": ["ALPHA", "BETA", "GAMMA", "DELTA", "THETA", "SIGMA", "PI", "OMEGA", "LAMBDA", "PHI"],
  "NOBEL PRIZE CATEGORIES": ["PHYSICS", "CHEMISTRY", "MEDICINE", "LITERATURE", "PEACE", "ECONOMICS"],
  "SQL ISOLATION LEVELS": ["READ UNCOMMITTED", "READ COMMITTED", "REPEATABLE READ", "SERIALIZABLE"],
  "SHAKESPEARE TRAGEDIES": ["HAMLET", "MACBETH", "OTHELLO", "KING LEAR", "ROMEO AND JULIET", "JULIUS CAESAR"],
  "CHEMICAL FUNCTIONAL GROUPS": ["ALCOHOL", "ALDEHYDE", "KETONE", "CARBOXYLIC ACID", "ESTER", "AMINE", "AMIDE"],
  "COMMON CIPHER NAMES": ["CAESAR", "VIGENERE", "SUBSTITUTION", "TRANSPOSITION", "RSA", "AES", "ENIGMA"],
  
  // Extreme categories
  "PANGRAMS": ["THE QUICK BROWN FOX", "PACK MY BOX WITH", "HOW VEXINGLY QUICK", "SPHINX OF BLACK QUARTZ"],
  "RARE CHESS OPENINGS": ["BIRD'S OPENING", "GROB ATTACK", "ORANGUTAN", "DURKIN OPENING", "BARNES OPENING"],
  "OBSOLETE SI UNITS": ["ANGSTROM", "MICRON", "FERMI", "ABAMPERE", "DYNE", "ERG", "CALORIE"],
  "ENGLISH WORDS ENDING IN -GRY": ["ANGRY", "HUNGRY", "HANGRY"],
  "TYPE-I SUPERNOVA PRECURSORS": ["WHITE DWARF", "BINARY STAR", "ACCRETION", "CHANDRASEKHAR LIMIT"]
};

// Fallback to API if no curated set exists
export async function getSynonyms(keyword: string): Promise<string[]> {
  // First check if we have a curated set
  const normalizedKeyword = keyword.toUpperCase();
  
  if (CURATED_SETS[normalizedKeyword]) {
    // Get 4 random words from our curated set
    const allWords = CURATED_SETS[normalizedKeyword];
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }
  
  // Fallback to API
  try {
    const res = await fetch(
      `https://api.datamuse.com/words?ml=${encodeURIComponent(keyword)}&max=20`
    );
    if (!res.ok) throw new Error('Datamuse failed');
    
    const json = await res.json();
    return json
      .map((w: { word: string }) => w.word.toUpperCase())
      .filter((w: string) => w.length > 2); // Filter out very short words
  } catch (error) {
    console.error('API error:', error);
    // Emergency fallback - return generic words related to the category
    return ["EXAMPLE", "INSTANCE", "TYPE", "KIND"].map(w => 
      `${w} OF ${keyword.toUpperCase()}`
    );
  }
}