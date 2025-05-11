'use client';

import React from 'react';

interface TimerProps {
  time: number; // seconds
}

export default function Timer({ time }: TimerProps) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="text-lg font-medium text-foreground">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}