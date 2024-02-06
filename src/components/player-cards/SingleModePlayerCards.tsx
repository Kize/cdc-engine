import { JSX } from 'react';
import { useAppSelector } from '../../store/store.ts';
import { selectPlayerCardDetails } from '../../store/current-game/current-game-selectors.ts';
import { Box } from '@chakra-ui/react';
import { PlayerCard } from './PlayerCard.tsx';

export function SingleModePlayerCards(): JSX.Element {
  const players = useAppSelector(selectPlayerCardDetails);

  return (
    <>
      {players.map((details) => (
        <Box pb={1} key={details.player}>
          <PlayerCard details={details} />
        </Box>
      ))}
    </>
  );
}
