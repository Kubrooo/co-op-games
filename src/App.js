import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/Navbar';
import { FloatingParticles } from './components/FloatingParticles';
import { Home } from './pages/Home';
import { Lobby } from './pages/Lobby';
import { Game } from './pages/Game';
import { Results } from './pages/Results';

function MainRouter() {
  const { page } = useGame();

  const renderPage = () => {
    switch (page) {
      case 'HOME':
        return <Home />;
      case 'LOBBY':
        return <Lobby />;
      case 'GAME':
        return <Game />;
      case 'RESULTS':
        return <Results />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center">
        {renderPage()}
      </main>
      <footer className="w-full text-center py-4 text-[11px] text-white/30 font-semibold border-t border-white/5">
        Duo Chaos Arcade © 2026 — Built with 🎮 for 2-player gamers everywhere
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <FloatingParticles />
      <MainRouter />
    </GameProvider>
  );
}
