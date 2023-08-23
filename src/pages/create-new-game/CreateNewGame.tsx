import { JSX, useState } from 'react';
import './CreateNewGame.css';
import { Button, Heading } from '@chakra-ui/react';
import { PlayersSelection } from './PlayersSelection.tsx';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store.ts';
import { selectRulesConfiguration } from '../../store/current-game/current-game-selectors.ts';
import { RulesSelection } from './RulesSelection.tsx';
import { startGameThunk } from '../../store/current-game/current-game-thunks.ts';

export function CreateNewGame(): JSX.Element {
  const rulesConfiguration = useAppSelector(selectRulesConfiguration);

  const [playersForm, setPlayersForm] = useState([] as Array<string>);
  const [rulesForm, setRulesForm] = useState(rulesConfiguration);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const startGame = () => {
    dispatch(startGameThunk(playersForm, rulesForm));

    navigate('/scribe-panel');
  };

  return (
    <>
      <Heading as="h1" size="lg">
        Nouvelle partie
      </Heading>

      <RulesSelection rules={rulesForm} setRules={setRulesForm} />

      <PlayersSelection setPlayers={setPlayersForm} maxPlayers={8} />

      <Button
        isDisabled={playersForm.length < 2 || playersForm.length > 8}
        onClick={startGame}
      >
        Jouer
      </Button>
    </>
  );
}
