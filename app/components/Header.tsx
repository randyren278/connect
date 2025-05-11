'use client';
import React from 'react';
import { useTheme } from 'next-themes';
import { ModeToggle } from './mode-toggle';

const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background border-b">
      <h1
        className="text-2xl font-semibold text-foreground cursor-pointer"
        onClick={handleReload}
      >
        Connections
      </h1>
      <ModeToggle />
    </header>
  );
};

export default Header;