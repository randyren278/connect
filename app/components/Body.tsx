'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameBoard from './GameBoard';
import Timer from './Timer';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { shuffleArray } from '@/lib/shuffle';

interface Group {
  title: string;
  words: string[];
  color: string;
}

export default function Body() {
  /* ------------------------------------------------------------------ *
   *                             STATE                                  *
   * ------------------------------------------------------------------ */
  const [correctGroups, setCorrectGroups] = useState<Group[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [foundGroups, setFoundGroups] = useState<Group[]>([]);
  const [mistakesRemaining, setMistakesRemaining] = useState(4);
  const [timer, setTimer] = useState(0);
  const [message, setMessage] = useState('');

  const [successTime, setSuccessTime] = useState<number | null>(null);
  const [failureTime, setFailureTime] = useState<number | null>(null);

  const [pendingGroup, setPendingGroup] = useState<Group | null>(null);
  const [pendingIndices, setPendingIndices] = useState<number[]>([]);

  const [isRevealing, setIsRevealing] = useState(false); // reveal animation running
  const [revealed, setRevealed] = useState(false);       // player pressed button
  const [revealQueue, setRevealQueue] = useState<Group[]>([]);

  /* derived flags */
  const totalGroups = correctGroups.length;
  const loaded = totalGroups > 0;
  const isFailure = mistakesRemaining <= 0 && foundGroups.length < totalGroups;
  const allSolved = foundGroups.length === totalGroups;

  const ease = [0.4, 0.0, 0.2, 1];

  /* ------------------------------------------------------------------ *
   *                      REVEAL‑MODE HELPERS                           *
   * ------------------------------------------------------------------ */

  /** full duration (ms) of one wave for `count` cards */
  const waveDurationMs = (count: number) =>
    (0.3 + (count - 1) * 0.2 + 0.4 + 0.3) * 1000;

  /** kick off one wave */
  const queueReveal = (group: Group) => {
    // Find indices of the words in this group
    const idxs = [];
    for (const word of group.words) {
      const idx = words.indexOf(word);
      if (idx !== -1) {
        idxs.push(idx);
      }
    }

    setPendingGroup(group);
    setPendingIndices(idxs);
  };

  /** Process the next reveal in queue */
  const processNextReveal = () => {
    if (revealQueue.length === 0 || isRevealing) return;
    
    setIsRevealing(true);
    const nextGroup = revealQueue[0];
    queueReveal(nextGroup);
    
    // Remove this group from the queue
    setRevealQueue(queue => queue.slice(1));
  };

  /** Handle click on "Reveal Answers" */
  const revealAnswers = () => {
    if (isRevealing) return;

    /* groups still unsolved */
    const remaining = correctGroups.filter(g => !foundGroups.includes(g));
    if (!remaining.length) return;

    setRevealed(true);         // permanently hide failure modal
    
    // Create a queue of groups to reveal
    setRevealQueue(remaining);
  };

  /* ------------------------------------------------------------------ *
   *                       LIFE‑CYCLE / FETCH                           *
   * ------------------------------------------------------------------ */

  const fetchPuzzle = async () => {
    try {
      const res = await fetch('/api/connections', { cache: 'no-store' });
      if (!res.ok) throw new Error('API error');
      const data: { groups: Group[] } = await res.json();

      setCorrectGroups(data.groups);
      setWords(shuffleArray(data.groups.flatMap(g => g.words)));
      setSelected([]);
      setFoundGroups([]);
      setMistakesRemaining(4);
      setTimer(0);
      setMessage('');
      setSuccessTime(null);
      setFailureTime(null);
      setPendingGroup(null);
      setPendingIndices([]);
      setIsRevealing(false);
      setRevealed(false);
      setRevealQueue([]);
    } catch (e) {
      console.error(e);
      setMessage('❌ Could not load puzzle. Please refresh.');
    }
  };

  useEffect(() => { fetchPuzzle(); }, []);
  useEffect(() => {
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  /* Win bookkeeping */
  useEffect(() => {
    if (
      loaded &&
      failureTime === null &&
      allSolved &&
      successTime === null
    ) {
      setSuccessTime(timer);
    }
  }, [loaded, failureTime, allSolved, timer, successTime]);

  /* Loss bookkeeping */
  useEffect(() => {
    if (loaded && isFailure && failureTime === null) {
      setFailureTime(timer);
    }
  }, [loaded, isFailure, timer, failureTime]);

  /* Process reveal queue when it changes */
  useEffect(() => {
    if (revealQueue.length > 0 && !isRevealing) {
      processNextReveal();
    }
  }, [revealQueue, isRevealing]);

  /* pending‑group completion */
  useEffect(() => {
    if (!pendingGroup) return;
    const delay = waveDurationMs(pendingIndices.length);

    const id = setTimeout(() => {
      setFoundGroups(fg => [...fg, pendingGroup]);
      setWords(ws => ws.filter(w => !pendingGroup.words.includes(w)));
      setPendingGroup(null);
      setPendingIndices([]);
      setIsRevealing(false);
      
      // Process next group in queue if any
      setTimeout(() => {
        if (revealQueue.length > 0) {
          processNextReveal();
        }
      }, 500); // Small delay between groups
    }, delay);

    return () => clearTimeout(id);
  }, [pendingGroup, pendingIndices, revealQueue]);

  /* ------------------------------------------------------------------ *
   *                               ACTIONS                              *
   * ------------------------------------------------------------------ */

  const handleCardClick = (idx: number) => {
    setSelected(sel =>
      sel.includes(idx)
        ? sel.filter(i => i !== idx)
        : sel.length < 4
        ? [...sel, idx]
        : sel
    );
  };

  const handleDeselectAll = () => {
    setSelected([]);
    setMessage('');
  };

  const handleShuffle = () => {
    setWords(shuffleArray(words));
    setSelected([]);
    setMessage('');
  };

  const handleSubmit = () => {
    if (selected.length !== 4) {
      setMessage('❌ Select exactly 4 cards before submitting.');
      return;
    }
    const chosen = selected.map(i => words[i]);
    const match = correctGroups.find(
      g => g.words.every(w => chosen.includes(w))
    );

    if (match && !foundGroups.includes(match)) {
      setPendingGroup(match);
      setPendingIndices(selected);
      setSelected([]);
      setMessage('');
    } else {
      const oneAway = correctGroups.some(
        g =>
          !foundGroups.includes(g) &&
          g.words.filter(w => chosen.includes(w)).length === 3
      );
      setMistakesRemaining(m => m - 1);
      setMessage(oneAway ? '⚠️ One away' : '❌ Incorrect group.');
      setSelected([]);
    }
  };

  /* ------------------------------------------------------------------ *
   *                               RENDER                               *
   * ------------------------------------------------------------------ */

  return (
    <div className="p-6 font-semibold">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <Timer time={timer} />
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={handleShuffle}
            disabled={!loaded || isRevealing}
            className="hover:scale-105 transition-transform duration-200"
          >
            Shuffle
          </Button>
          <Button
            variant="outline"
            onClick={handleDeselectAll}
            disabled={!selected.length || isRevealing}
            className="hover:scale-105 transition-transform duration-200"
          >
            Deselect All
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={!loaded || allSolved || isFailure || isRevealing}
            className="hover:scale-105 transition-transform duration-200"
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Mistakes */}
      <div className="mb-4 text-sm">
        Mistakes Remaining:
        <span className="ml-2 inline-flex space-x-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className={`inline-block h-3 w-3 rounded-full transition-colors duration-300 ${
                i < mistakesRemaining ? 'bg-foreground' : 'bg-gray-300'
              }`}
            />
          ))}
        </span>
      </div>

      {/* Alerts */}
      {(message.startsWith('❌') || message.startsWith('⚠️')) && (
        <Alert
          variant={message.startsWith('❌') ? 'destructive' : undefined}
          className={`mb-4 transition-opacity duration-300 ${
            message.startsWith('⚠️')
              ? 'border-yellow-400 bg-yellow-100 text-black'
              : ''
          }`}
        >
          {message}
        </Alert>
      )}

      {/* Solved groups */}
      <div className="space-y-4 mb-6 overflow-hidden">
        <AnimatePresence>
          {foundGroups.map(g => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className={`${g.color} text-black p-4 rounded-lg`}
            >
              <h3 className="font-bold text-lg">{g.title}</h3>
              <p>{g.words.join(', ')}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Game board */}
      {loaded && (
        <motion.div
          key={words.join('|')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease }}
        >
          <GameBoard
            words={words}
            selected={selected}
            onCardClick={handleCardClick}
            pending={isRevealing}
            pendingIndices={pendingIndices}
          />
        </motion.div>
      )}

      {/* Bottom Play‑Again (after reveal) */}
      {loaded && (allSolved || (revealed && revealQueue.length === 0 && !isRevealing)) && (
        <div className="flex justify-center mt-8">
          <Button variant="default" onClick={fetchPuzzle}>
            Play Again
          </Button>
        </div>
      )}

      {/* Overlays */}
      <AnimatePresence>
        {/* Win modal */}
        {loaded && successTime !== null && !revealed && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease }}
              className="bg-background p-8 rounded-lg shadow-lg shadow-black/40 text-foreground"
            >
              <h2 className="text-3xl mb-4">🎉 Congratulations!</h2>
              <p className="mb-4">You solved the puzzle in {successTime} s.</p>
              <Button variant="default" onClick={fetchPuzzle}>
                Play Again
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Failure modal (suppressed after Reveal click) */}
        {loaded && isFailure && failureTime !== null && !revealed && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease }}
              className="bg-background p-8 rounded-lg shadow-lg shadow-black/40 text-foreground"
            >
              <h2 className="text-3xl mb-4">😞 Try Again Next Time</h2>
              <p className="mb-4">Time taken: {failureTime} s.</p>

              <div className="flex gap-3">
                <Button variant="default" onClick={fetchPuzzle}>
                  Try Again
                </Button>
                <Button
                  variant="secondary"
                  onClick={revealAnswers}
                  disabled={isRevealing || revealQueue.length > 0}
                >
                  Reveal Answers
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}