import { JSX } from 'react';
import { PlayerCard } from './PlayerCard.tsx';
import { Button, Center, Stack } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../store/store.ts';
import { selectPlayersWithScore } from '../../store/current-game/current-game-selectors.ts';
import { resetGameThunk } from '../../store/current-game/current-game-thunks.ts';
import { DiceForm } from '../../components/dice/DiceForm.tsx';

export function ScribePanel(): JSX.Element {
  const players = useAppSelector(selectPlayersWithScore);

  const dispatch = useAppDispatch();

  return (
    <>
      <Button onClick={() => dispatch(resetGameThunk())}>Reset</Button>

      <Center>
        <Stack width="80vw">
          {players.map((details) => (
            <PlayerCard key={details.player} details={details}></PlayerCard>
          ))}
        </Stack>
      </Center>

      <DiceForm onChangeForm={console.log} />
    </>
  );
}
