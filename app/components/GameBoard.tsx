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

export default function GameBoard({ 
  words, 
  selected, 
  onCardClick, 
  pending = false, 
  pendingIndices = [] 
}: GameBoardProps) {
  // Create cards with original indices
  const cards = words.map((word, idx) => ({ word, originalIndex: idx }));
  
  // If we're in pending state, reorder cards to show pending cards first
  let displayCards = cards;
  if (pending && pendingIndices.length) {
    // Get the cards that match pending indices
    const pendingCards = pendingIndices
      .map(idx => cards.find(c => c.originalIndex === idx))
      .filter(Boolean) as typeof cards;
    
    // Get remaining cards
    const rest = cards.filter(c => !pendingIndices.includes(c.originalIndex));
    
    // Combine for display
    displayCards = [...pendingCards, ...rest];
  }

  const baseDelay = pending ? 0.3 : 0;
  
  return (
    <div className="grid grid-cols-4 gap-4">
      {displayCards.map(c => {
        // Find the wave position (if card is in pendingIndices)
        const waveIndex = pendingIndices.indexOf(c.originalIndex);
        const isWave = pending && waveIndex > -1;
        const delay = isWave ? baseDelay + waveIndex * 0.2 : 0;
        
        return (
          <Card 
            key={c.originalIndex} 
            word={c.word} 
            index={c.originalIndex} 
            selected={selected.includes(c.originalIndex)} 
            onCardClick={onCardClick} 
            wave={isWave} 
            waveDelay={delay} 
          />
        );
      })}
    </div>
  );
}