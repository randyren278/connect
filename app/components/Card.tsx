'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

interface CardProps {
  word: string;
  index: number;
  selected: boolean;
  onCardClick: (idx: number) => void;
  wave?: boolean;
  waveDelay?: number;
}

const waveVariants: Variants = {
  initial: { y: 0 },
  wave: { y: [0, -30, 0] },
};

export default function Card({ word, index, selected, onCardClick, wave = false, waveDelay = 0 }: CardProps) {
  return (
    <motion.button
      onClick={() => onCardClick(index)}
      initial="initial"
      animate={wave ? 'wave' : 'initial'}
      variants={waveVariants}
      transition={wave ? { duration: 0.4, ease: 'linear', delay: waveDelay } : {}}
      className={`
        flex items-center justify-center
        h-20 rounded-lg border
        transition-all duration-200
        ${selected ? 'bg-accent text-black dark:text-white border-accent shadow-lg shadow-black/20' : 'bg-background border-border hover:scale-105 text-black dark:text-white'}
      `}
    >
      {word}
    </motion.button>
  );
}