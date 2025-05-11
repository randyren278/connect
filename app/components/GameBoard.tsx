'use client';

import React from 'react';
import Card from './Card';

interface GameBoardProps {
  words: string[];
  selected: number[];
  onCardClick: (idx: number) => void;
}

export default function GameBoard({ words, selected, onCardClick }: GameBoardProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {words.map((word, idx) => (
        <Card
          key={idx}
          word={word}
          index={idx}
          selected={selected.includes(idx)}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
}