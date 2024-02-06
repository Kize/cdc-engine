import { JSX, useState } from 'react';
import { Box, Button, Center, Heading, SimpleGrid } from '@chakra-ui/react';
import { PlayersSelection } from './PlayersSelection.tsx';
import { useAppDispatch, useAppSelector } from '../../store/store.ts';
import { selectRulesConfiguration } from '../../store/current-game/current-game-selectors.ts';
import { RulesSelectionPanel } from './RulesSelectionPanel.tsx';
import { startGameThunk } from '../../store/current-game/current-game-lifecycle-thunks.ts';

export function CreateNewGame(): JSX.Element {
  const rulesConfiguration = useAppSelector(selectRulesConfiguration);

  const [isDoublette, setIsDoublette] = useState<boolean>(false);
  const [playersForm, setPlayersForm] = useState<Array<string>>([]);
  const [rulesForm, setRulesForm] = useState(rulesConfiguration);

  const dispatch = useAppDispatch();

  const isStartButtonDisabled =
    playersForm.length < 2 ||
    playersForm.length > 8 ||
    (isDoublette && (playersForm.length % 2 !== 0 || playersForm.length < 4));

  return (
    <>
      <Heading as="h1" size="lg">
        Nouvelle partie
      </Heading>

      <SimpleGrid columns={[1, 2]}>
        <Box p={3}>
          <PlayersSelection
            setPlayers={setPlayersForm}
            isDoublette={isDoublette}
            toggleIsDoublette={() => {
              setIsDoublette(!isDoublette);
            }}
            maxPlayers={8}
          />
        </Box>

        <Box p={3}>
          <RulesSelectionPanel rules={rulesForm} setRules={setRulesForm} />
        </Box>
      </SimpleGrid>

      <Center my={5}>
        <Button
          size="lg"
          colorScheme="blue"
          isDisabled={isStartButtonDisabled}
          onClick={() =>
            dispatch(startGameThunk(isDoublette, playersForm, rulesForm))
          }
        >
          Jouer
        </Button>
      </Center>
    </>
  );
}
