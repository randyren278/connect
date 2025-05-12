// lib/seedThemes.ts
import { shuffleArray } from '@/lib/shuffle';

/* ------------------------------------------------------------------ *
 * 1.  MASTER “SEEDS” ARRAYS                                           *
 * ------------------------------------------------------------------ *
 *    Each difficulty array lists the *human‑readable* theme titles.
 *    They map 1‑to‑1 to CURATED_SETS keys (after normalisation).
 */

export const seeds = {
  /* ------------------------------  50 EASY  ----------------------- */
  easy: [
    'colors',
    'days',
    'planets',
    'card suits',
    'Canadian provinces',
    'Disney princesses',
    'primary school subjects',
    'Beatles members',
    'fruits',
    'vegetables',
    'zodiac signs',
    'compass directions',
    'seasons',
    'continents',
    'face senses',
    'basic shapes',
    'chess pieces',
    'English vowels',
    'Harry Potter houses',
    'Marvel Avengers',
    'Star Wars droids',
    'Pokémon starters',
    'types of coffee drinks',
    'US coin values',
    'metric prefixes (small)',
    'metric prefixes (large)',
    'finger names',
    'basic emotions',
    'ice‑cream flavors',
    'birthday gemstones',
    'ballet positions',
    'social media apps',
    'musical dynamics',
    'common dog breeds',
    'common cat breeds',
    'tennis Grand Slams',
    'NBA positions',
    'NFL positions',
    'simple machines',
    'computer keyboard rows',
    'months',
    'primary colors of light',
    'traffic light colors',
    'farm animals',
    'domestic pets',
    'insects',
    'body parts (limbs)',
    'luxury car brands',
    'musical notes (solfege)',
    'basic punctuation marks',
  ],

  /* -----------------------------  50 MEDIUM  ---------------------- */
  medium: [
    'types of energy',
    'classical elements',
    'word homophones',
    'famous physicists',
    'computer ports',
    'HTTP status codes',
    'big‑O notations',
    'programming paradigms',
    'sorting algorithms',
    'planet moons (big 4)',
    'HTML heading tags',
    'Linux package managers',
    'cloud service models',
    'cryptocurrency coins',
    'web browsers',
    'keyboard shortcuts',
    'film genres',
    'poetry meters',
    'European rivers',
    'African capitals',
    'South American capitals',
    'world deserts',
    'types of pasta',
    'cooking knife cuts',
    'sushi types',
    'yoga poses',
    'Olympic decathlon events',
    'ISO country codes (G‑10)',
    'car body styles',
    'electric guitar brands',
    'classical composers',
    'Bach suites instruments',
    'famous chemists',
    'unit prefixes binary',
    'IPv4 classes',
    'prime numbers (first 8)',
    'Greek muses',
    'Bond actors',
    'literary devices',
    'meteorological cloud types',
    'poker hand ranks',
    'currencies of G7',
    'asteroid belt dwarf planets',
    'human blood types',
    'morse code letters (E‑T‑A‑O)',
    'common file extensions',
    'RGB web colors',
    'standard paper sizes (ISO)',
    'cardinal virtues',
  ],

  /* -----------------------------  50 HARD  ------------------------ */
  hard: [
    'Greek letters used in math',
    'Nobel prize categories',
    'SQL isolation levels',
    'Shakespeare tragedies',
    'chemical functional groups',
    'common cipher names',
    'UN security council members',
    'IEEE 754 rounding modes',
    'TCP handshake flags',
    'space shuttle names',
    'Apollo landing sites',
    'IC fabrication nodes',
    'ARM privilege levels',
    'quantum numbers',
    'linear algebra matrix types',
    'types of differential eqns',
    'z‑transform ROC types',
    'Fourier series symmetries',
    'logic gate varieties',
    'NP‑complete problems',
    'boolean algebra laws',
    'data‑link layer protocols',
    'OSI layers',
    'Haskell typeclasses',
    'Rust ownership states',
    'HTTP request verbs',
    'graph traversal algorithms',
    'Linux init systems',
    'CSS units',
    'Unicode normalization forms',
    'IPv6 address scopes',
    'relational normal forms',
    'web safe fonts',
    'finite state machine types',
    'quantum logic gates',
    'matrix factorizations',
    'Bayes theorem terms',
    'error‑detecting codes',
    'disk scheduling algorithms',
    'container orchestration tools',
    'design pattern categories',
    'micro‑kernel examples',
    'cache mapping strategies',
    'branch prediction hints (x86)',
    'open source licenses',
    'hash collision attacks',
    'memory consistency models',
    'floating‑point exceptions',
    'digital modulation schemes',
  ],

  /* -----------------------------  50 EXTREME ---------------------- */
  extreme: [
    'pangrams',
    'rare chess openings',
    'obsolete SI units',
    'type‑I supernova precursors',
    'English words ending in -gry',
    'mythical hybrid creatures',
    'famous unsolved ciphers',
    'xkcd color names',
    'hyperbolic plane tessellations',
    'quantum error codes',
    'NASA rover names',
    'IMAP status responses',
    'Gödel incompleteness pairs',
    'Turing machine states',
    'Unix days of Christmas',
    'esoteric programming languages',
    'ISO 4217 precious metals',
    'Borges imaginary beasts',
    'prime constellation names',
    'Weierstrass function traits',
    'Mozart K‑numbers (single digits)',
    'lyapunov exponents signs',
    'strange attractor names',
    'hyperspace dimensions (string)',
    'quantum spin statistics',
    'ELIZA script stages',
    'Erdős number categories',
    'hyper‑operations beyond tetration',
    'polyomino names',
    'alien languages in sci‑fi',
    'RNA codon stops',
    'Higgs field excitations',
    'Planck units',
    'non‑trivial zero conjectures',
    'large cardinal types',
    'mathematical surreal numbers',
    'impossible objects',
    'indescribable numbers',
    'zero‑knowledge proof steps',
    'black hole classifications',
    'CRISPR Cas variants',
    'cyberpunk megacities',
    'cryptographic time‑lock puzzles',
    'infinite monkey theorem outputs',
    'cosmic microwave anomalies',
    'von Neumann probe stages',
    'LHC detector names',
    'deep sea trench zones',
    'antimatter storage methods',
  ],
} as const;

export type Difficulty = keyof typeof seeds;

/* ------------------------------------------------------------------ *
 * 2.  CURATED WORD LISTS                                             *
 * ------------------------------------------------------------------ *
 *    Keys must be NORMALISED (see normalizeKey() below).
 *    Only 4+ words needed; getSynonyms() will shuffle & slice.
 */
const CURATED_SETS: Record<string, string[]> = {
  /* ---------------------  EASY  (50) ----------------------------- */
  'BALLET POSITIONS': ['FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH'],
  'BASIC EMOTIONS': ['HAPPY', 'SAD', 'ANGRY', 'FEAR', 'DISGUST', 'SURPRISE'],
  'BASIC PUNCTUATION MARKS': ['PERIOD', 'COMMA', 'QUESTION', 'EXCLAMATION'],
  'BASIC SHAPES': ['CIRCLE', 'SQUARE', 'TRIANGLE', 'RECTANGLE', 'OVAL'],
  'BEATLES MEMBERS': ['JOHN', 'PAUL', 'GEORGE', 'RINGO'],
  'BIRTHDAY GEMSTONES': ['GARNET', 'AMETHYST', 'EMERALD', 'RUBY', 'SAPPHIRE', 'TOPAZ'],
  'BODY PARTS (LIMBS)': ['ARM', 'LEG', 'HAND', 'FOOT'],
  'CANADIAN PROVINCES': ['ONTARIO', 'QUEBEC', 'ALBERTA', 'MANITOBA', 'SASKATCHEWAN', 'NOVA SCOTIA', 'NUNAVUT', 'YUKON'],
  'CARD SUITS': ['HEARTS', 'DIAMONDS', 'CLUBS', 'SPADES'],
  'CHESS PIECES': ['KING', 'QUEEN', 'ROOK', 'BISHOP', 'KNIGHT', 'PAWN'],
  'COLORS': ['RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'PURPLE'],
  'COMPASS DIRECTIONS': ['NORTH', 'SOUTH', 'EAST', 'WEST'],
  'COMPUTER KEYBOARD ROWS': ['QWERTY', 'ASDF', 'ZXCV', 'SPACE'],
  'COMMON CAT BREEDS': ['SIAMESE', 'PERSIAN', 'MAINE COON', 'BENGAL'],
  'COMMON DOG BREEDS': ['LABRADOR', 'BEAGLE', 'BULLDOG', 'POODLE'],
  'DISNEY PRINCESSES': ['ARIEL', 'BELLE', 'CINDERELLA', 'JASMINE', 'MULAN', 'ELSA', 'MOANA'],
  'DOMESTIC PETS': ['DOG', 'CAT', 'HAMSTER', 'RABBIT'],
  'ENGLISH VOWELS': ['A', 'E', 'I', 'O', 'U'],
  'FACE SENSES': ['SIGHT', 'SMELL', 'TASTE', 'HEARING', 'TOUCH'],
  'FARM ANIMALS': ['COW', 'PIG', 'CHICKEN', 'SHEEP', 'GOAT'],
  'FINGER NAMES': ['THUMB', 'INDEX', 'MIDDLE', 'RING', 'PINKY'],
  'FRUITS': ['APPLE', 'BANANA', 'GRAPE', 'ORANGE', 'PEAR'],
  'HARRY POTTER HOUSES': ['GRYFFINDOR', 'HUFFLEPUFF', 'RAVENCLAW', 'SLYTHERIN'],
  'ICE‑CREAM FLAVORS': ['VANILLA', 'CHOCOLATE', 'STRAWBERRY', 'MINT'],
  'INSECTS': ['ANT', 'BEE', 'BUTTERFLY', 'BEETLE'],
  'LUXURY CAR BRANDS': ['BMW', 'MERCEDES', 'AUDI', 'LEXUS'],
  'MARVEL AVENGERS': ['IRON MAN', 'THOR', 'HULK', 'CAPTAIN AMERICA'],
  'METRIC PREFIXES (LARGE)': ['KILO', 'MEGA', 'GIGA', 'TERA'],
  'METRIC PREFIXES (SMALL)': ['MILLI', 'MICRO', 'NANO', 'PICO'],
  'MONTHS': ['JANUARY', 'APRIL', 'JULY', 'OCTOBER'],
  'MUSICAL DYNAMICS': ['FORTE', 'PIANO', 'MEZZO', 'CRESCENDO'],
  'MUSICAL NOTES (SOLFEGE)': ['DO', 'RE', 'MI', 'FA', 'SO', 'LA', 'TI'],
  'NBA POSITIONS': ['CENTER', 'POWER FORWARD', 'SMALL FORWARD', 'SHOOTING GUARD', 'POINT GUARD'],
  'NFL POSITIONS': ['QUARTERBACK', 'RUNNING BACK', 'LINEBACKER', 'WIDE RECEIVER'],
  'PETS (EXOTIC)': ['PARROT', 'FERRET', 'IGUANA', 'GECKO'],
  'PLANETS': ['MERCURY', 'VENUS', 'EARTH', 'MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE'],
  'POKÉMON STARTERS': ['BULBASAUR', 'CHARMANDER', 'SQUIRTLE', 'PIKACHU'],
  'PRIMARY COLORS OF LIGHT': ['RED', 'GREEN', 'BLUE'],
  'PRIMARY SCHOOL SUBJECTS': ['MATH', 'SCIENCE', 'READING', 'WRITING'],
  'SEASONS': ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'],
  'SIMPLE MACHINES': ['WHEEL', 'LEVER', 'PULLEY', 'INCLINED PLANE', 'SCREW', 'WEDGE'],
  'SOCIAL MEDIA APPS': ['FACEBOOK', 'INSTAGRAM', 'SNAPCHAT', 'TIKTOK'],
  'STAR WARS DROIDS': ['R2‑D2', 'C‑3PO', 'BB‑8', 'K‑2SO'],
  'TENNIS GRAND SLAMS': ['WIMBLEDON', 'US OPEN', 'ROLAND GARROS', 'AUSTRALIAN OPEN'],
  'TRAFFIC LIGHT COLORS': ['RED', 'YELLOW', 'GREEN'],
  'US COIN VALUES': ['PENNY', 'NICKEL', 'DIME', 'QUARTER'],
  'VEGETABLES': ['CARROT', 'BROCCOLI', 'POTATO', 'ONION'],
  'ZODIAC SIGNS': ['ARIES', 'TAURUS', 'GEMINI', 'CANCER', 'LEO', 'VIRGO'],
  /* ---------------------  MEDIUM  (50) --------------------------- */
  'AFRICAN CAPITALS': ['CAIRO', 'NAIROBI', 'ABUJA', 'ACCRA'],
  'ASTERIOD BELT DWARF PLANETS': ['CERES', 'VESTA', 'HYGEIA', 'PALLAS'],
  'BACH SUITES INSTRUMENTS': ['CELLO', 'LUTE', 'VIOLIN', 'ORCHESTRA'],
  'BOND ACTORS': ['CONNERY', 'MOORE', 'DALTON', 'BROSNAN', 'CRAIG'],
  'CAR BODY STYLES': ['SEDAN', 'COUPE', 'HATCHBACK', 'CONVERTIBLE', 'SUV'],
  'CLASSICAL COMPOSERS': ['BACH', 'MOZART', 'BEETHOVEN', 'CHOPIN'],
  'CLASSICAL ELEMENTS': ['FIRE', 'WATER', 'EARTH', 'AIR', 'ETHER'],
  'CLOUD SERVICE MODELS': ['IAAS', 'PAAS', 'SAAS', 'FAAS'],
  'COOKING KNIFE CUTS': ['DICE', 'JULIENNE', 'MINCE', 'CHIFFONADE'],
  'CRYPTOCURRENCY COINS': ['BITCOIN', 'ETHEREUM', 'DOGECOIN', 'LITECOIN'],
  'CSS BOX SIZING VALUES': ['CONTENT‑BOX', 'BORDER‑BOX', 'PADDING‑BOX', 'MARGIN‑BOX'],
  'DATA‑LINK LAYER PROTOCOLS': ['ETHERNET', 'PPP', 'HDLC', 'TOKEN RING'],
  'EUROPEAN RIVERS': ['DANUBE', 'RHINE', 'ELBE', 'THAMES'],
  'FILM GENRES': ['COMEDY', 'DRAMA', 'THRILLER', 'HORROR'],
  'FAMOUS CHEMISTS': ['CURIE', 'MENDELEEV', 'LAVOISIER', 'PAULING'],
  'FAMOUS PHYSICISTS': ['EINSTEIN', 'NEWTON', 'FEYNMAN', 'BOHR'],
  'HTML HEADING TAGS': ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
  'HTTP STATUS CODES': ['200', '301', '404', '500'],
  'HUMAN BLOOD TYPES': ['A', 'B', 'AB', 'O'],
  'ISO COUNTRY CODES (G‑10)': ['US', 'UK', 'FR', 'DE', 'JP', 'CA', 'IT', 'NL', 'BE', 'SE'],
  'KEYBOARD SHORTCUTS': ['CTRL‑C', 'CTRL‑V', 'CTRL‑Z', 'CTRL‑S'],
  'LINUX PACKAGE MANAGERS': ['APT', 'YUM', 'PACMAN', 'DNF'],
  'METEOROLOGICAL CLOUD TYPES': ['CIRRUS', 'CUMULUS', 'STRATUS', 'NIMBUS'],
  'MORSE CODE LETTERS (E‑T‑A‑O)': ['E', 'T', 'A', 'O'],
  'PLANET MOONS (BIG 4)': ['LUNA', 'PHOBOS', 'DEIMOS', 'TITAN', 'EUROPA'],
  'POETRY METERS': ['IAMBIC', 'TROCHAIC', 'DACTYLIC', 'ANAPESTIC'],
  'PRIME NUMBERS (FIRST 8)': ['2', '3', '5', '7', '11', '13', '17', '19'],
  'PROGRAMMING PARADIGMS': ['OBJECT‑ORIENTED', 'FUNCTIONAL', 'PROCEDURAL', 'DECLARATIVE'],
  'RGB WEB COLORS': ['RED', 'GREEN', 'BLUE', 'BLACK', 'WHITE'],
  'SORTING ALGORITHMS': ['QUICKSORT', 'MERGESORT', 'HEAP SORT', 'BUBBLE SORT'],
  'SPACE SHUTTLE NAMES': ['COLUMBIA', 'CHALLENGER', 'DISCOVERY', 'ATLANTIS', 'ENDEAVOUR'],
  'STANDARD PAPER SIZES (ISO)': ['A0', 'A1', 'A2', 'A3', 'A4'],
  'SUSHI TYPES': ['NIGIRI', 'MAKI', 'SASHIMI', 'TEMAKI'],
  'TCP HANDSHAKE FLAGS': ['SYN', 'ACK', 'FIN', 'RST'],
  'TRAFFIC SIGN SHAPES': ['OCTAGON', 'TRIANGLE', 'CIRCLE', 'DIAMOND'],
  'TYPES OF ENERGY': ['KINETIC', 'POTENTIAL', 'THERMAL', 'CHEMICAL'],
  'TYPES OF PASTA': ['SPAGHETTI', 'PENNE', 'FARFALLE', 'MACARONI'],
  'UNIT PREFIXES BINARY': ['KIBI', 'MEBI', 'GIBI', 'TEBI'],
  'WEB BROWSERS': ['CHROME', 'FIREFOX', 'EDGE', 'SAFARI', 'OPERA'],
  'WORLD DESERTS': ['SAHARA', 'GOBI', 'KALAHARI', 'ATACAMA'],
  'YOGA POSES': ['TREE', 'LOTUS', 'COBRA', 'WARRIOR'],
  /* ---------------------  HARD   (50) ---------------------------- */
  'APOLLO LANDING SITES': ['TRANQUILLITY', 'FRA MAURO', 'HADLEY', 'TAURUS‑LITTROW'],
  'ARM PRIVILEGE LEVELS': ['EL0', 'EL1', 'EL2', 'EL3'],
  'BOOLEAN ALGEBRA LAWS': ['ASSOCIATIVE', 'DISTRIBUTIVE', 'IDENTITY', 'DEMORGAN'],
  'CACHE MAPPING STRATEGIES': ['DIRECT', 'FULLY ASSOCIATIVE', 'SET ASSOCIATIVE', 'N‑WAY'],
  'COMMON CIPHER NAMES': ['AES', 'DES', 'RSA', 'CAESAR', 'VIGENERE'],
  'CONTAINER ORCHESTRATION TOOLS': ['KUBERNETES', 'DOCKER SWARM', 'NOMAD', 'MESOS'],
  'DIGITAL MODULATION SCHEMES': ['ASK', 'FSK', 'PSK', 'QAM'],
  'ERROR‑DETECTING CODES': ['PARITY', 'CRC', 'CHECKSUM', 'HAMMING'],
  'FINITE STATE MACHINE TYPES': ['MEALY', 'MOORE', 'MEDVED'],
  'FLOATING‑POINT EXCEPTIONS': ['OVERFLOW', 'UNDERFLOW', 'DIVIDE‑BY‑ZERO', 'INVALID'],
  'FOURIER SERIES SYMMETRIES': ['EVEN', 'ODD', 'HALF‑WAVE', 'QUARTER‑WAVE'],
  'GRAPH TRAVERSAL ALGORITHMS': ['DFS', 'BFS', 'DIJKSTRA', 'A*'],
  'GREEK LETTERS USED IN MATH': ['ALPHA', 'BETA', 'DELTA', 'SIGMA', 'THETA', 'PI'],
  'HASH COLLISION ATTACKS': ['BIRTHDAY', 'MULTI‑COLLISION', 'XOR‑EXTENSION', 'LENGTH EXTENSION'],
  'HASKELL TYPECLASSES': ['FUNCTOR', 'APPLICATIVE', 'MONAD', 'FOLDABLE'],
  'HTTP REQUEST VERBS': ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  'IC FABRICATION NODES': ['45NM', '28NM', '14NM', '7NM', '5NM'],
  'IEEE 754 ROUNDING MODES': ['NEAREST', 'TOWARD ZERO', 'UP', 'DOWN'],
  'LINEAR ALGEBRA MATRIX TYPES': ['SYMMETRIC', 'SKEW‑SYMMETRIC', 'DIAGONAL', 'ORTHOGONAL'],
  'LINUX INIT SYSTEMS': ['SYSTEMD', 'SYSV', 'UPSTART', 'OPENRC'],
  'LOGIC GATE VARIETIES': ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR'],
  'MEMORY CONSISTENCY MODELS': ['SEQ‑CONSISTENT', 'TSO', 'PSO', 'RC'],
  'MICRO‑KERNEL EXAMPLES': ['QNX', 'L4', 'MINIX', 'SEL4'],
  'MATRIX FACTORIZATIONS': ['LU', 'QR', 'SVD', 'CHOLESKY'],
  'NP‑COMPLETE PROBLEMS': ['SAT', 'CLIQUE', 'HAMILTONIAN', 'SUBSET SUM'],
  'OPEN SOURCE LICENSES': ['MIT', 'GPL', 'APACHE', 'BSD'],
  'OSI LAYERS': ['PHYSICAL', 'DATA LINK', 'NETWORK', 'TRANSPORT', 'SESSION', 'PRESENTATION', 'APPLICATION'],
  'QUANTUM GATES': ['HADAMARD', 'CNOT', 'PAULI‑X', 'TOFFOLI'],
  'QUANTUM NUMBERS': ['PRINCIPAL', 'AZIMUTHAL', 'MAGNETIC', 'SPIN'],
  'RELATIONAL NORMAL FORMS': ['1NF', '2NF', '3NF', 'BCNF'],
  'RUST OWNERSHIP STATES': ['OWNED', 'BORROWED', 'MUT BORROWED', 'DROPPED'],
  'SPACE SHUTTLE NAMES (FULL)': ['COLUMBIA', 'CHALLENGER', 'DISCOVERY', 'ATLANTIS', 'ENDEAVOUR'],
  'SQL ISOLATION LEVELS': ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'],
  'TCP HANDSHAKE FLAGS (FULL)': ['SYN', 'ACK', 'FIN', 'RST', 'URG', 'PSH'],
  'TYPES OF DIFFERENTIAL EQNS': ['ODE', 'PDE', 'LIOUVILLE', 'RICCATI'],
  'UNICODE NORMALIZATION FORMS': ['NFC', 'NFD', 'NFKC', 'NFKD'],
  'UN SECURITY COUNCIL MEMBERS': ['USA', 'UK', 'FRANCE', 'RUSSIA', 'CHINA'],
  'Z‑TRANSFORM ROC TYPES': ['INTERIOR', 'EXTERIOR', 'ANNULAR'],
  'WEB SAFE FONTS': ['ARIAL', 'VERDANA', 'TIMES', 'COURIER'],
  'DESIGN PATTERN CATEGORIES': ['CREATIONAL', 'STRUCTURAL', 'BEHAVIORAL', 'CONCURRENCY'],
  'CONTAINER IMAGE FORMATS': ['DOCKER', 'OCI', 'SIF', 'CPI'],
  'BRANCH PREDICTION HINTS (X86)': ['TAKEN', 'NOT TAKEN', 'NEVER'],
  'CACHE REPLACEMENT POLICIES': ['LRU', 'FIFO', 'RANDOM', 'LFU'],
  'DISK SCHEDULING ALGORITHMS': ['FCFS', 'SSTF', 'SCAN', 'C‑SCAN'],
  'ERROR CORRECTION CODES': ['HAMMING', 'REED‑SOLOMON', 'LDPC', 'TURBO'],
  'FILE SYSTEM TYPES': ['EXT4', 'NTFS', 'APFS', 'FAT32'],
  'DIGITAL SIGNATURE ALGORITHMS': ['RSA', 'DSA', 'ECDSA', 'EDDSA'],
  'MICROCONTROLLER PERIPHERALS': ['ADC', 'DAC', 'UART', 'SPI'],
  'PERCEPTRON ACTIVATIONS': ['RELU', 'SIGMOID', 'TANH', 'LINEAR'],
  /* ---------------------  EXTREME (50) --------------------------- */
  'ANTIMATTER STORAGE METHODS': ['PENNING TRAP', 'MAGNETIC BOTTLE', 'LASER COOLING', 'ICF CAPSULE'],
  'BORGES IMAGINARY BEASTS': ['ALEPH', 'AXOLOTL', 'HYLEG', 'PIABOCO'],
  'BLACK HOLE CLASSIFICATIONS': ['STELLAR', 'INTERMEDIATE', 'SUPERMASSIVE', 'PRIMORDIAL'],
  'COSMIC MICROWAVE ANOMALIES': ['AXIS OF EVIL', 'COLD SPOT', 'HEMISPHERIC', 'QUADRUPOLE'],
  'CRISPR CAS VARIANTS': ['CAS9', 'CAS12', 'CAS13', 'CAS14'],
  'CRYPTIC TIME‑LOCK PUZZLES': ['RIVEST', 'MERKLE', 'HELLMAN', 'TIMECAPS'],
  'DEEP SEA TRENCH ZONES': ['BATHYAL', 'ABYSSAL', 'HADAL', 'PELAGIC'],
  'ELIZA SCRIPT STAGES': ['GREETING', 'RECURSION', 'MIRROR', 'CLOSING'],
  'ENGLISH WORDS ENDING IN -GRY': ['ANGRY', 'HUNGRY', 'HANGRY', 'AGRY'],
  'ERDŐS NUMBER CATEGORIES': ['0', '1', '2', 'INFINITE'],
  'ESOTERIC PROGRAMMING LANGUAGES': ['BRAIN****', 'MALBOLGE', 'WHITESPACE', 'INTERCAL'],
  'FAMOUS UNSOLVED CIPHERS': ['VOYNICH', 'DORABELLA', 'KRYPTOS', 'BEALE'],
  'GÖDEL INCOMPLETENESS PAIRS': ['TRUE', 'UNPROVABLE', 'CONSISTENT', 'INCOMPLETE'],
  'HIGGS FIELD EXCITATIONS': ['HIGGS BOSON', 'GOLDSTONE', 'RADION', 'DILATON'],
  'HYPERBOLIC PLANE TESSELLATIONS': ['{7,3}', '{5,4}', '{4,5}', '{3,7}'],
  'IMPOSSIBLE OBJECTS': ['PENROSE TRIANGLE', 'NECKER CUBE', 'DEVILS FORK', 'POSSIBLE IMP'],
  'IMAP STATUS RESPONSES': ['OK', 'NO', 'BAD', 'BYE'],
  'INFINITE MONKEY THEOREM OUTPUTS': ['HAMLET', 'ODYSSEY', 'BIBLE', 'SHAKESPEARE'],
  'INDESCRIBABLE NUMBERS': ['BUSCH', 'FADDEN', 'WOODIN', 'SUPERSTRONG'],
  'ISO 4217 PRECIOUS METALS': ['XAU', 'XAG', 'XPT', 'XPD'],
  'LARGE CARDINAL TYPES': ['MEASURABLE', 'SUPERCOMPACT', 'INACCESSIBLE', 'INEFFABLE'],
  'LHC DETECTOR NAMES': ['ATLAS', 'CMS', 'LHCb', 'ALICE'],
  'LYAPUNOV EXPONENTS SIGNS': ['POSITIVE', 'NEGATIVE', 'ZERO', 'INFINITE'],
  'MATHEMATICAL SURREAL NUMBERS': ['DYADIC', 'INFINITE', 'FRACTIONAL', 'NEGATIVE'],
  'MOZART K‑NUMBERS (SINGLE DIGIT)': ['K1', 'K2', 'K3', 'K4'],
  'MYTHICAL HYBRID CREATURES': ['MINOTAUR', 'HIPPOGRIFF', 'MANTICORE', 'SPHINX'],
  'NASA ROVER NAMES': ['SOJOURNER', 'SPIRIT', 'OPPORTUNITY', 'CURIOSITY', 'PERSEVERANCE'],
  'NON‑TRIVIAL ZERO CONJECTURES': ['RIEMANN', 'MONTGOMERY', 'SELBERG', 'GENERALIZED'],
  'PLANCK UNITS': ['PLANCK LENGTH', 'PLANCK MASS', 'PLANCK TIME', 'PLANCK CHARGE'],
  'POLYOMINO NAMES': ['MONOMINO', 'DOMINO', 'TROMINO', 'TETROMINO', 'PENTOMINO'],
  'PRIME CONSTELLATION NAMES': ['DRACO', 'OPHIUCHUS', 'SERPENS', 'PHOENIX'],
  'QUANTUM ERROR CODES': ['STEANE', 'SHOR', 'SURFACE', 'TORIC'],
  'QUANTUM SPIN STATISTICS': ['FERMION', 'BOSON', 'ANYON', 'PARAFERMION'],
  'RNA CODON STOPS': ['UAA', 'UAG', 'UGA', 'OPAL'],
  'STRANGE ATTRACTOR NAMES': ['LORENZ', 'HENON', 'ROSSLER', 'IKEDA'],
  'STRING THEORY DIMENSIONS': ['10D', '11D', '26D', 'M‑THEORY'],
  'TURING MACHINE STATES': ['START', 'ACCEPT', 'REJECT', 'HALT'],
  'TYPE‑I SUPERNOVA PRECURSORS': ['WHITE DWARF', 'BINARY STAR', 'ACCRETION', 'CHANDRASEKHAR LIMIT'],
  'UNIX DAYS OF CHRISTMAS': ['FORK', 'EXEC', 'PIPE', 'KILL', 'CHMOD'],
  'VON NEUMANN PROBE STAGES': ['LAUNCH', 'LAND', 'REPLICATE', 'EXPLORE'],
  'WEIERSTRASS FUNCTION TRAITS': ['CONTINUOUS', 'NOWHERE DIFFERENTIABLE', 'SELF‑SIMILAR', 'FRACTAL'],
  'XKCD COLOR NAMES': ['GREENISH', 'REDDISH', 'BLUISH', 'YELLOWISH'],
  'ZERO‑KNOWLEDGE PROOF STEPS': ['COMMIT', 'CHALLENGE', 'RESPONSE', 'VERIFY'],
};

/* Some tricky titles → nicer API terms */
const API_OVERRIDES: Record<string, string> = {
  'TYPE‑I SUPERNOVA PRECURSORS': 'supernova precursor',
  'OBSOLETE SI UNITS': 'old scientific unit',
  'BIG‑O NOTATIONS': 'time complexity',
};

/* ------------------------------------------------------------------ *
 * 3.  HELPERS                                                        *
 * ------------------------------------------------------------------ */
function normalizeKey(keyword: string): string {
  return keyword
    .trim()
    .toUpperCase()
    .replace(/[\u2010-\u2015]/g, '-')  // hyphen variants
    .replace(/[’‘]/g, "'")             // curly → straight
    .replace(/\s+/g, ' ');
}

function buildApiQuery(keyword: string): string {
  const key = normalizeKey(keyword);
  return API_OVERRIDES[key] ?? keyword;
}

/* ------------------------------------------------------------------ *
 * 4.  MAIN: getSynonyms                                              *
 * ------------------------------------------------------------------ */
export async function getSynonyms(keyword: string): Promise<string[]> {
  const key = normalizeKey(keyword);

  /* 1) Curated? */
  if (CURATED_SETS[key]) {
    return shuffleArray(CURATED_SETS[key]).slice(0, 4);
  }

  /* 2) Datamuse */
  const query = buildApiQuery(keyword);
  try {
    let res = await fetch(
      `https://api.datamuse.com/words?rel_syn=${encodeURIComponent(query)}&max=20`
    );
    if (!res.ok) throw new Error('Datamuse rel_syn failed');
    let cands: string[] = (await res.json())
      .map((w: { word: string }) => w.word.toUpperCase())
      .filter((w: string) => /^[A-Z0-9()\-]+$/.test(w))
      .filter((w: string) => w.length >= 3 && w.length <= 15);

    if (cands.length < 4) {
      res = await fetch(
        `https://api.datamuse.com/words?ml=${encodeURIComponent(query)}&max=20`
      );
      if (res.ok) {
        cands = cands.concat(
          (await res.json())
            .map((w: { word: string }) => w.word.toUpperCase())
            .filter((w: string) => /^[A-Z0-9()\-]+$/.test(w))
            .filter((w: string) => w.length >= 3 && w.length <= 15)
        );
      }
    }

    if (cands.length >= 4) {
      return shuffleArray([...new Set(cands)]).slice(0, 4);
    }
  } catch (e) {
    console.error('getSynonyms error:', e);
  }

  /* 3) Emergency fallback */
  return ['EXAMPLE', 'INSTANCE', 'TYPE', 'KIND'].map(w => `${w} OF ${query.toUpperCase()}`).slice(0, 4);
}
