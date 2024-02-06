import { JSX } from 'react';
import { useAppSelector } from '../../../store/store.ts';
import { SingleModePlayerCards } from '../../../components/player-cards/SingleModePlayerCards.tsx';
import { DoubletteModePlayerCards } from '../../../components/player-cards/DoubletteModePlayerCards.tsx';

export function PlayerDetailsSummary(): JSX.Element {
  const isDoublette = useAppSelector((state) => state.currentGame.isDoublette);

  return (
    <>
      {!isDoublette && <SingleModePlayerCards />}
      {isDoublette && <DoubletteModePlayerCards />}
    </>
  );
}
