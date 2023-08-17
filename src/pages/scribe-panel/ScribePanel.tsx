import { JSX } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage.ts';
import { PlayerCard } from './PlayerCard.tsx';
import { Center, Stack } from '@chakra-ui/react';

export function ScribePanel(): JSX.Element {
  const [savedPlayers] = useLocalStorage<Array<string>>('players', []);

  const players = savedPlayers
    .slice(0, 6)
    .map((p, i) => ({ name: p, score: (1 + i) * 57 }));

  return (
    <>
      <Center>
        <Stack width="80vw">
          {players.map((player) => (
            <PlayerCard key={player.name} player={player}></PlayerCard>
          ))}
        </Stack>
      </Center>
    </>
  );
}
