import { JSX, useState } from 'react';
import './CreateNewGame.css';
import { Button, Heading } from '@chakra-ui/react';
import { PlayersSelection } from './PlayersSelection.tsx';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store.ts';
import { setPlayersAction } from '../../store/current-game/current-game.slice.ts';
import { cdcGameHandler } from '../../store/current-game/current-game-thunks.ts';
import { GameStatus } from '../../../lib/game/game-handler.ts';
import {
  selectEvents,
  selectPlayers,
  selectRulesConfiguration,
} from '../../store/current-game/current-game-selectors.ts';
import { RulesSelection } from './RulesSelection.tsx';

export function CreateNewGame(): JSX.Element {
  const rulesConfiguration = useAppSelector(selectRulesConfiguration);
  const players = useAppSelector(selectPlayers);
  const events = useAppSelector(selectEvents);
  const gameStatus = cdcGameHandler.getGameStatus(events, players);

  const [playersForm, setPlayersForm] = useState([] as Array<string>);
  const [rulesForm, setRulesForm] = useState(rulesConfiguration);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const startGame = () => {
    dispatch(setPlayersAction(playersForm));

    navigate('/scribe-panel');
  };

  return (
    <>
      {gameStatus === GameStatus.IN_GAME && <Navigate to="/scribe-panel" />}

      <Heading as="h1" size="lg">
        Nouvelle partie
      </Heading>

      <RulesSelection rules={rulesForm} setRules={setRulesForm} />

      <PlayersSelection setPlayers={setPlayersForm} maxPlayers={8} />

      <Button
        isDisabled={players.length < 2 || players.length > 8}
        onClick={startGame}
      >
        Jouer
      </Button>
    </>
  );
}
