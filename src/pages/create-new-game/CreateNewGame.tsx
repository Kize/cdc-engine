import { JSX, useState } from 'react';
import './CreateNewGame.css';
import { Button, Center, Heading } from '@chakra-ui/react';
import { PlayersSelection } from './PlayersSelection.tsx';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store.ts';
import { setPlayersAction } from '../../store/current-game/current-game.slice.ts';
import { gameHandler } from '../../store/current-game/current-game-thunks.ts';
import { GameStatus } from '../../../lib/game/game-handler.ts';
import {
  selectEvents,
  selectPlayers,
} from '../../store/current-game/current-game-selectors.ts';

export function CreateNewGame(): JSX.Element {
  const players = useAppSelector(selectPlayers);
  const events = useAppSelector(selectEvents);
  const gameStatus = gameHandler.getGameStatus(events, players);

  const [playersForm, setPlayersForm] = useState([] as Array<string>);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const startGame = () => {
    dispatch(setPlayersAction(playersForm));

    navigate('/scribe-panel');
  };

  return (
    <>
      {gameStatus === GameStatus.IN_GAME && <Navigate to="/scribe-panel" />}

      <Heading>Nouvelle partie</Heading>

      <Center>
        <PlayersSelection setPlayers={setPlayersForm} maxPlayers={8} />
      </Center>

      <Button
        isDisabled={players.length < 2 || players.length > 8}
        onClick={startGame}
      >
        Jouer
      </Button>
    </>
  );
}
