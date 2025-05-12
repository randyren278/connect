'use client';

import React from 'react';
import Card from './Card';

interface GameBoardProps {
  words: string[];
  selected: number[];
  onCardClick: (idx: number) => void;
  pending?: boolean;
  pendingIndices?: number[];
}

export default function GameBoard({ words, selected, onCardClick, pending = false, pendingIndices = [] }: GameBoardProps) {
  const cards = words.map((word, idx) => ({ word, originalIndex: idx }));
  const sorted = pendingIndices.slice().sort((a, b) => a - b);
  let displayCards = cards;
  if (pending && sorted.length) {
    const pendingCards = sorted.map(i => cards.find(c => c.originalIndex === i)!);
    const rest = cards.filter(c => !sorted.includes(c.originalIndex));
    displayCards = [...pendingCards, ...rest];
  }
  const baseDelay = pending ? 0.3 : 0;

  return (
    <div className="grid grid-cols-4 gap-4">
      {displayCards.map(c => {
        const waveIndex = sorted.indexOf(c.originalIndex);
        const isWave = pending && waveIndex > -1;
        const delay = isWave ? baseDelay + waveIndex * 0.2 : 0;
        return (
          <Card key={c.originalIndex} word={c.word} index={c.originalIndex} selected={selected.includes(c.originalIndex)} onCardClick={onCardClick} wave={isWave} waveDelay={delay} />
        );
      })}
    </div>
  );
}
