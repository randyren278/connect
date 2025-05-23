// app/components/Body.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Timer from './Timer';
import GameBoard from './GameBoard';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { shuffleArray } from '@/lib/shuffle';

/* ------------------------------------------------------------------ *
 *  TYPES                                                             *
 * ------------------------------------------------------------------ */
interface Group {
  title: string;
  words: string[];
  color: string;
}

/* ------------------------------------------------------------------ *
 *  LOCAL‑STORAGE KEYS & HELPERS                                      *
 * ------------------------------------------------------------------ */
const LS_THEMES = 'conn_used_themes';     // last 40 theme titles
const LS_KEYS   = 'conn_used_groupKeys';  // last 40 group keys

const norm = (s: string) => s.trim().toUpperCase().replace(/\s+/g, ' ');
const keyOf = (ws: readonly string[]) => [...ws].map(norm).sort().join('|');

const loadArr = (key: string): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(arr) ? arr.slice(-40) : [];
  } catch {
    return [];
  }
};

const saveArr = (key: string, arr: string[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(arr.slice(-40)));
    } catch {
      /* ignore quota errors */
    }
  }
};

/* ------------------------------------------------------------------ *
 *  COMPONENT                                                         *
 * ------------------------------------------------------------------ */
export default function Body() {
  const usedThemesRef = useRef<string[]>([]);
  const usedKeysRef   = useRef<string[]>([]);

  /* ----------------------------- STATE ---------------------------- */
  const [correctGroups, setCorrectGroups] = useState<Group[]>([]);
  const [words,         setWords]         = useState<string[]>([]);
  const [selected,      setSelected]      = useState<number[]>([]);
  const [foundGroups,   setFoundGroups]   = useState<Group[]>([]);
  const [mistakes,      setMistakes]      = useState(4);
  const [timer,         setTimer]         = useState(0);
  const [msg,           setMsg]           = useState('');

  const [successT, setSuccessT] = useState<number | null>(null);
  const [failureT, setFailureT] = useState<number | null>(null);

  const [pendingG,   setPendingG]   = useState<Group | null>(null);
  const [pendingIdx, setPendingIdx] = useState<number[]>([]);
  const [revealing,  setRevealing]  = useState(false);
  const [revealed,   setRevealed]   = useState(false);
  const [queue,      setQueue]      = useState<Group[]>([]);

  /* derived flags */
  const loaded    = correctGroups.length > 0;
  const failed    = mistakes <= 0 && foundGroups.length < correctGroups.length;
  const allSolved = foundGroups.length === correctGroups.length;

  /* ------------------------------------------------------------------ *
   *  FETCH PUZZLE WITH NO‑REPEAT LOGIC                                *
   * ------------------------------------------------------------------ */
  const fetchPuzzle = async () => {
    try {
      let data: { groups: Group[] };
      let tries = 0;

      do {
        const res = await fetch('/api/connections', { cache: 'no-store' });
        if (!res.ok) throw new Error('API error');
        data = await res.json();

        const themes = data.groups.map(g => norm(g.title));
        const keys   = data.groups.map(g => keyOf(g.words));

        const repeatTheme = themes.some(t => usedThemesRef.current.includes(t));
        const repeatKey   = keys.some(k => usedKeysRef.current.includes(k));
        const dupesInPuzzle =
          new Set(data.groups.flatMap(g => g.words)).size !==
          data.groups.flatMap(g => g.words).length;

        if (!repeatTheme && !repeatKey && !dupesInPuzzle) {
          usedThemesRef.current = [...usedThemesRef.current, ...themes].slice(-40);
          usedKeysRef.current   = [...usedKeysRef.current,   ...keys  ].slice(-40);
          saveArr(LS_THEMES, usedThemesRef.current);
          saveArr(LS_KEYS,   usedKeysRef.current);
          break;
        }
        tries++;
      } while (tries < 10);

      setCorrectGroups(data.groups);
      setWords(shuffleArray(data.groups.flatMap(g => g.words)));
      setSelected([]); setFoundGroups([]);
      setMistakes(4); setTimer(0); setMsg('');
      setSuccessT(null); setFailureT(null);
      setPendingG(null); setPendingIdx([]);
      setRevealing(false); setRevealed(false); setQueue([]);
    } catch (e) {
      console.error(e);
      setMsg('❌ Could not load puzzle. Please refresh.');
    }
  };

  /* ------------------------------------------------------------------ *
   *  EFFECTS                                                           *
   * ------------------------------------------------------------------ */
  useEffect(() => {
    usedThemesRef.current = loadArr(LS_THEMES);
    usedKeysRef.current   = loadArr(LS_KEYS);
    fetchPuzzle();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { if (loaded && allSolved) setSuccessT(t => t ?? timer); },
    [loaded, allSolved, timer]);
  useEffect(() => { if (loaded && failed)   setFailureT(t => t ?? timer); },
    [loaded, failed, timer]);

  /* --------------------- wave / reveal helpers -------------------- */
  const waveMs = (n: number) => (0.3 + (n - 1) * 0.2 + 0.7) * 1000;

  const queueReveal = (g: Group) => {
    const idxs = g.words.map(w => words.indexOf(w)).filter(i => i !== -1);
    setRevealing(true); setPendingG(g); setPendingIdx(idxs);
  };

  const nextReveal = () => {
    if (!queue.length || revealing) return;
    queueReveal(queue[0]); setQueue(q => q.slice(1));
  };

  useEffect(() => { if (queue.length && !revealing) nextReveal(); },
    [queue, revealing]);

  useEffect(() => {
    if (!pendingG) return;
    const id = setTimeout(() => {
      setFoundGroups(f => [...f, pendingG]);
      setWords(w => w.filter(v => !pendingG.words.includes(v)));
      setPendingG(null); setPendingIdx([]); setRevealing(false);
      setTimeout(() => { if (queue.length) nextReveal(); }, 400);
    }, waveMs(pendingIdx.length));
    return () => clearTimeout(id);
  }, [pendingG, pendingIdx, queue]);

  /* ------------------------------------------------------------------ *
   *  ACTIONS                                                           *
   * ------------------------------------------------------------------ */
  const click = (i: number) =>
    setSelected(sel =>
      sel.includes(i) ? sel.filter(x => x !== i) : sel.length < 4 ? [...sel, i] : sel
    );

  const deselect = () => setSelected([]);
  const shuffle  = () => {
    setWords(shuffleArray(words));
    setSelected([]);
    setMsg('');
  };

  const submit = () => {
    if (selected.length !== 4) {
      setMsg('❌ Select exactly 4 cards before submitting.');
      return;
    }
    const chosen = selected.map(i => words[i]);
    const match = correctGroups.find(g => g.words.every(w => chosen.includes(w)));

    if (match && !foundGroups.includes(match)) {
      queueReveal(match);
      deselect();
      setMsg('');
      return;
    }

    const oneAway = correctGroups.some(
      g =>
        !foundGroups.includes(g) &&
        g.words.filter(w => chosen.includes(w)).length === 3
    );
    setMistakes(m => m - 1);
    setMsg(oneAway ? '⚠️ One away' : '❌ Incorrect group.');
    deselect();
  };

  const reveal = () => {
    if (revealing) return;
    const remain = correctGroups.filter(g => !foundGroups.includes(g));
    if (remain.length) { setRevealed(true); setQueue(remain); }
  };

  /* ------------------------------------------------------------------ *
   *  RENDER                                                            *
   * ------------------------------------------------------------------ */
  return (
    <div className="p-6 font-semibold">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <Timer time={timer} />
        <div className="space-x-2">
          <Button variant="outline" onClick={shuffle}
            disabled={!loaded || revealing}>Shuffle</Button>
          <Button variant="outline" onClick={deselect}
            disabled={!selected.length || revealing}>Deselect</Button>
          <Button variant="default" onClick={submit}
            disabled={!loaded || allSolved || failed || revealing}>Submit</Button>
        </div>
      </div>

      {/* Mistakes */}
      <div className="mb-4 text-sm">
        Mistakes:
        <span className="ml-2 inline-flex space-x-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}
              className={`inline-block h-3 w-3 rounded-full
                ${i < mistakes ? 'bg-foreground' : 'bg-gray-300'}`} />
          ))}
        </span>
      </div>

      {/* Alerts */}
      {(msg.startsWith('❌') || msg.startsWith('⚠️')) && (
        <Alert
          variant={msg.startsWith('❌') ? 'destructive' : undefined}
          className={
            msg.startsWith('⚠️')
              ? 'mb-4 border-yellow-400 bg-yellow-100 text-black'
              : 'mb-4'
          }
        >
          {msg}
        </Alert>
      )}

      {/* Solved groups */}
      <div className="space-y-4 mb-6 overflow-hidden">
        <AnimatePresence>
          {foundGroups.map(g => (
            <motion.div key={g.title}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${g.color} text-black p-4 rounded-lg`}>
              <h3 className="font-bold text-lg">{g.title}</h3>
              <p>{g.words.join(', ')}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Game board */}
      {loaded && (
        <motion.div key={words.join('|')}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}>
          <GameBoard
            words={words}
            selected={selected}
            onCardClick={click}
            pending={revealing}
            pendingIndices={pendingIdx}
          />
        </motion.div>
      )}

      {/* Bottom Play Again */}
      {loaded && revealed && !revealing && queue.length === 0 && (
        <div className="flex justify-center mt-8">
          <Button variant="default" onClick={fetchPuzzle}>Play Again</Button>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {loaded && successT !== null && !revealed && (
          <motion.div className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-background p-8 rounded-lg shadow-lg shadow-black/40 text-foreground">
              <h2 className="text-3xl mb-4">🎉 Congratulations!</h2>
              <p className="mb-4">Solved in {successT} s.</p>
              <div className="flex gap-3">
                <Button variant="default" onClick={fetchPuzzle}>Play Again</Button>
                <Button variant="default" onClick={() => setRevealed(true)}>View</Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {loaded && failed && failureT !== null && !revealed && (
          <motion.div className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-background p-8 rounded-lg shadow-lg shadow-black/40 text-foreground">
              <h2 className="text-3xl mb-4">😞 Try Again</h2>
              <p className="mb-4">Time: {failureT} s.</p>
              <div className="flex gap-3">
                <Button variant="default" onClick={fetchPuzzle}>Try Again</Button>
                <Button variant="secondary" onClick={reveal}
                  disabled={revealing || queue.length > 0}>Reveal Answers</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
