import { JSX, useState } from 'react';
import './CreateNewGame.css';
import { Box, Button, Center, Heading, SimpleGrid } from '@chakra-ui/react';
import { PlayersSelection } from './PlayersSelection.tsx';
import { useAppDispatch, useAppSelector } from '../../store/store.ts';
import { selectRulesConfiguration } from '../../store/current-game/current-game-selectors.ts';
import { RulesSelectionPanel } from './RulesSelectionPanel.tsx';
import { startGameThunk } from '../../store/current-game/current-game-lifecycle-thunks.ts';

export function CreateNewGame(): JSX.Element {
  const rulesConfiguration = useAppSelector(selectRulesConfiguration);

  const [playersForm, setPlayersForm] = useState([] as Array<string>);
  const [rulesForm, setRulesForm] = useState(rulesConfiguration);

  const dispatch = useAppDispatch();

  return (
    <>
      <Heading as="h1" size="lg">
        Nouvelle partie
      </Heading>

      <SimpleGrid columns={[1, 2]}>
        <Box p={3}>
          <PlayersSelection setPlayers={setPlayersForm} maxPlayers={8} />
        </Box>

        <Box p={3}>
          <RulesSelectionPanel rules={rulesForm} setRules={setRulesForm} />
        </Box>
      </SimpleGrid>

      <Center my={5}>
        <Button
          size="lg"
          colorScheme="blue"
          isDisabled={playersForm.length < 2 || playersForm.length > 8}
          onClick={() => dispatch(startGameThunk(playersForm, rulesForm))}
        >
          Jouer
        </Button>
      </Center>
    </>
  );
}
