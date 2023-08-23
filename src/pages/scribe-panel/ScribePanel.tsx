import { JSX } from 'react';
import { PlayerCard } from './PlayerCard.tsx';
import { Button, Center, Stack } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../store/store.ts';
import { useNavigate } from 'react-router-dom';
import { selectPlayersWithScore } from '../../store/current-game/current-game-selectors.ts';
import { currentGameSlice } from '../../store/current-game/current-game.slice.ts';

export function ScribePanel(): JSX.Element {
  const players = useAppSelector(selectPlayersWithScore);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onReset = () => {
    dispatch(currentGameSlice.actions.resetGame());
    navigate('/');
  };

  return (
    <>
      <Center>
        <Button onClick={onReset}>Reset</Button>

        <Stack width="80vw">
          {players.map((player) => (
            <PlayerCard
              key={player.name}
              player={player.name}
              score={player.score}
            ></PlayerCard>
          ))}
        </Stack>
      </Center>
    </>
  );
}
