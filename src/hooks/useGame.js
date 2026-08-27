import { useGame as useGameContext } from '../context/GameContext';

export function useGame() {
  return useGameContext();
}
