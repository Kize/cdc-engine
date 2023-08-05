import { JSX, useState } from 'react';
import './CreateNewGame.css';
import { Button, Center, Heading } from '@chakra-ui/react';
import { PlayersSelection } from './PlayersSelection.tsx';

export function CreateNewGame(): JSX.Element {
  const [players, setPlayers] = useState([] as Array<string>);

  const startGame = () => {
    console.log(players);
  };

  return (
    <>
      <Heading>Nouvelle partie</Heading>

      <Center>
        <PlayersSelection setPlayers={setPlayers} maxPlayers={8} />
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
