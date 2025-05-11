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
  { title: 'MAKE HAPPY',               words: ['DELIGHT', 'PLEASE', 'SUIT', 'TICKLE'],     color: 'bg-yellow-300' },
  { title: 'EVADE',                    words: ['DODGE', 'DUCK', 'SHAKE', 'SKIRT'],         color: 'bg-green-300' },
  { title: 'COMMON VIDEO GAME FEATURES', words: ['BOSS', 'HEALTH', 'LEVEL', 'POWER-UP'],    color: 'bg-blue-300' },
  { title: 'MOTHER ___',               words: ['EARTH', 'GOOSE', 'MAY I', 'SUPERIOR'],     color: 'bg-purple-300' },
];

export default function Body() {
  const [words, setWords] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [foundGroups, setFoundGroups] = useState<Group[]>([]);
  const [mistakesRemaining, setMistakesRemaining] = useState(4);
  const [timer, setTimer] = useState(0);
  const [message, setMessage] = useState<string>('');
  const totalGroups = correctGroups.length;

  // Start/reset game
  useEffect(() => {
    resetGame();
  }, []);

  // Timer tick
  useEffect(() => {
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  function resetGame() {
    setWords(shuffleArray(correctGroups.flatMap(g => g.words)));
    setSelected([]);
    setFoundGroups([]);
    setMistakesRemaining(4);
    setTimer(0);
    setMessage('');
  }

  function handleCardClick(idx: number) {
    setSelected(sel => {
      if (sel.includes(idx)) return sel.filter(i => i !== idx);
      if (sel.length < 4) return [...sel, idx];
      return sel;
    });
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
      setMessage('Select exactly 4 cards before submitting.');
      return;
    }
    const chosen = selected.map(i => words[i]);
    const match = correctGroups.find(g =>
      g.words.every(w => chosen.includes(w))
    );

    if (match && !foundGroups.includes(match)) {
      setFoundGroups(fg => [...fg, match]);
      setWords(ws => ws.filter(w => !match.words.includes(w)));
      setMessage(`✅ You found: ${match.title}!`);
    } else {
      setMistakesRemaining(m => m - 1);
      setMessage('❌ Incorrect group.');
    }
    setSelected([]);
  }

  return (
    <div className="p-6 font-semibold">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <Timer time={timer} />
        <div className="space-x-2">
          <Button
            variant="outline"
            className="transition-transform duration-200 hover:scale-105"
            onClick={handleShuffle}
          >
            Shuffle
          </Button>
          <Button
            variant="outline"
            className="transition-transform duration-200 hover:scale-105"
            onClick={handleDeselectAll}
            disabled={!selected.length}
          >
            Deselect All
          </Button>
          <Button
            variant="default"
            className="transition-transform duration-200 hover:scale-105"
            onClick={handleSubmit}
            disabled={foundGroups.length === totalGroups}
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

      {/* Feedback */}
      {message && (
        <Alert
          variant={message.startsWith('❌') ? 'destructive' : 'accent'}
          className="mb-4 transition-opacity duration-300"
        >
          {message}
        </Alert>
      )}

      {/* Found Groups with size animation */}
      <div className="space-y-4 mb-6 overflow-hidden">
        <AnimatePresence>
          {foundGroups.map((g, idx) => (
            <motion.div
              key={g.title}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              exit={{ scaleX: 0, opacity: 0 }}
              className={`${g.color} text-black p-4 rounded-lg origin-left`}
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
        transition={{ duration: 0.5 }}
      >
        <GameBoard words={words} selected={selected} onCardClick={handleCardClick} />
      </motion.div>

      {/* Final View Results */}
      {foundGroups.length === totalGroups && (
        <div className="mt-6 text-center">
          <Button size="lg" variant="outline">
            View Results
          </Button>
        </div>
      )}
    </div>
  );
}