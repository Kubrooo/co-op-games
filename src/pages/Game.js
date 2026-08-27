import React from 'react';
import { useGame } from '../hooks/useGame';
import { ScoreBoard } from '../components/ScoreBoard';
import { RandomEventOverlay } from '../components/RandomEventOverlay';
import { WhoIsMoreLikely } from '../games/WhoIsMoreLikely';
import { Sync } from '../games/Sync';
import { ReactionBattle } from '../games/ReactionBattle';
import { MemoryChaos } from '../games/MemoryChaos';
import { DuoChallenge } from '../games/DuoChallenge';

export function Game() {
  const { currentGameType, activeEvent } = useGame();

  const renderGame = () => {
    switch (currentGameType) {
      case 'WHO_IS_MORE_LIKELY':
        return <WhoIsMoreLikely />;
      case 'SYNC':
        return <Sync />;
      case 'REACTION':
        return <ReactionBattle />;
      case 'MEMORY':
        return <MemoryChaos />;
      case 'DUO_CHALLENGE':
        return <DuoChallenge />;
      default:
        return <WhoIsMoreLikely />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 flex flex-col items-center">
      {/* Live ScoreBoard Header */}
      <ScoreBoard />

      {/* Active Random Event Banner */}
      <div className="w-full mt-4">
        <RandomEventOverlay event={activeEvent} />
      </div>

      {/* Current Minigame Arena */}
      <div className="w-full mt-2">
        {renderGame()}
      </div>
    </div>
  );
}
