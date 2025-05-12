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

const correctGroups: Group[] = [
  { title: 'MAKE HAPPY', words: ['DELIGHT','PLEASE','SUIT','TICKLE'], color: 'bg-yellow-300' },
  { title: 'EVADE', words: ['DODGE','DUCK','SHAKE','SKIRT'], color: 'bg-green-300' },
  { title: 'COMMON VIDEO GAME FEATURES', words: ['BOSS','HEALTH','LEVEL','POWER-UP'], color: 'bg-blue-300' },
  { title: 'MOTHER ___', words: ['EARTH','GOOSE','MAY I','SUPERIOR'], color: 'bg-purple-300' },
];

export default function Body() {
  const [words, setWords] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [foundGroups, setFoundGroups] = useState<Group[]>([]);
  const [mistakesRemaining, setMistakesRemaining] = useState(4);
  const [timer, setTimer] = useState(0);
  const [message, setMessage] = useState<string>('');

  const [successTime, setSuccessTime] = useState<number | null>(null);
  const [failureTime, setFailureTime] = useState<number | null>(null);

  const [pendingGroup, setPendingGroup] = useState<Group | null>(null);
  const [pendingIndices, setPendingIndices] = useState<number[]>([]);

  const totalGroups = correctGroups.length;
  const isFailure = mistakesRemaining <= 0 && foundGroups.length < totalGroups;

  useEffect(() => { resetGame(); }, []);
  useEffect(() => {
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (foundGroups.length === totalGroups && successTime === null) {
      setSuccessTime(timer);
    }
  }, [foundGroups.length, timer, totalGroups, successTime]);

  useEffect(() => {
    if (isFailure && failureTime === null) {
      setFailureTime(timer);
    }
  }, [isFailure, timer, failureTime]);

  function resetGame() {
    setWords(shuffleArray(correctGroups.flatMap(g => g.words)));
    setSelected([]);
    setFoundGroups([]);
    setMistakesRemaining(4);
    setTimer(0);
    setMessage('');
    setPendingGroup(null);
    setPendingIndices([]);
    setSuccessTime(null);
    setFailureTime(null);
  }

  function handleCardClick(idx: number) {
    setSelected(sel =>
      sel.includes(idx)
        ? sel.filter(i => i !== idx)
        : sel.length < 4
        ? [...sel, idx]
        : sel
    );
  }

  function handleDeselectAll() {
    setSelected([]);
    setMessage('');
  }

  function handleShuffle() {
    setWords(shuffleArray(words));
    setSelected([]);
    setMessage('');
  }

  function handleSubmit() {
    if (selected.length !== 4) {
      setMessage('❌ Select exactly 4 cards before submitting.');
      return;
    }
    const chosen = selected.map(i => words[i]);
    const match = correctGroups.find(g => g.words.every(w => chosen.includes(w)));
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
  }

  useEffect(() => {
    if (!pendingGroup) return;
    const baseDelay = 0.3;
    const stagger = 0.2;
    const waveDuration = 0.4;
    const postPause = 0.3;
    const count = pendingIndices.length;
    const totalDelay =
      (baseDelay + (count - 1) * stagger + waveDuration + postPause) * 1000;

    const timerId = setTimeout(() => {
      setFoundGroups(fg => [...fg, pendingGroup]);
      setWords(ws => ws.filter(w => !pendingGroup.words.includes(w)));
      setPendingGroup(null);
      setPendingIndices([]);
    }, totalDelay);
    return () => clearTimeout(timerId);
  }, [pendingGroup, pendingIndices]);

  const ease = [0.4, 0.0, 0.2, 1];

  return (
    <div className="p-6 font-semibold">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <Timer time={timer} />
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={handleShuffle}
            className="hover:scale-105 transition-transform duration-200"
          >
            Shuffle
          </Button>
          <Button
            variant="outline"
            onClick={handleDeselectAll}
            disabled={!selected.length}
            className="hover:scale-105 transition-transform duration-200"
          >
            Deselect All
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={foundGroups.length === totalGroups || isFailure}
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

      {/* Feedback Alert */}
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

      {/* Found Groups */}
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

      {/* Game Board */}
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
          pending={!!pendingGroup}
          pendingIndices={pendingIndices}
        />
      </motion.div>

      {/* End Popups */}
      <AnimatePresence>
        {/* Success */}
        {foundGroups.length === totalGroups && successTime !== null && (
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
              <p className="mb-4">You solved the puzzle in {successTime} seconds.</p>
              <Button variant="default" onClick={resetGame}>Play Again</Button>
            </motion.div>
          </motion.div>
        )}

        {/* Failure */}
        {isFailure && failureTime !== null && (
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
              <p className="mb-4">Time taken: {failureTime} seconds.</p>
              <Button variant="default" onClick={resetGame}>Try Again</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}