'use client';

import React from 'react';

interface CardProps {
  word: string;
  index: number;
  selected: boolean;
  onCardClick: (idx: number) => void;
}

export default function Card({ word, index, selected, onCardClick }: CardProps) {
  return (
    <button
      onClick={() => onCardClick(index)}
      className={`
        flex items-center justify-center
        h-20 rounded-lg border
        transition-all duration-200
        ${
          // Selected cards: accent bg with black text in light, white in dark
          selected
            ? 'bg-accent text-black dark:text-white border-accent shadow-lg shadow-black/20'
            : // Unselected cards: background + conditional text color
              'bg-background border-border hover:scale-105 text-black dark:text-white'
        }
      `}
    >
      {word}
    </button>
  );
}