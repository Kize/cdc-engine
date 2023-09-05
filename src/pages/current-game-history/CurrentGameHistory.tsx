import { JSX } from 'react';
import {
  Button,
  Center,
  Flex,
  Heading,
  Spacer,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../store/store.ts';
import {
  selectEvents,
  selectPlayers,
} from '../../store/current-game/current-game-selectors.ts';
import { GameLineType } from '../../../lib/history/history-line.ts';
import { Player } from '../../../lib/player.ts';
import { cdcGameHandler } from '../../utils/game-handler-configuration.ts';
import { TbArrowBackUp } from 'react-icons/tb';
import { cancelLastEventThunk } from '../../store/current-game/current-game-actions-thunks.ts';
import { Link } from 'react-router-dom';

export function CurrentGameHistory(): JSX.Element {
  const players = useAppSelector(selectPlayers);
  const events = useAppSelector(selectEvents);
  const dispatch = useAppDispatch();

  const getPlayerScore = (player: Player): number => {
    return cdcGameHandler.history.getPlayerScore(events, player);
  };

  return (
    <>
      <Flex mb={[2, 6]} mt={1} mx={2}>
        <Center pl={2}>
          <Heading fontSize="x-large">Historique de la partie</Heading>
        </Center>
        <Spacer />

        <Center>
          <Link to="/scribe-panel">Retour à la partie</Link>
        </Center>
        <Spacer />
      </Flex>

      <TableContainer>
        <Table variant="striped" size="lg">
          <Thead>
            <Tr>
              {players.map((player) => (
                <Th key={player}>
                  {player}
                  <Text as="b" fontSize="md" color="blue" ml={4}>
                    {getPlayerScore(player)} points
                  </Text>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {events.map((event, eventIndex) => (
              <Tr key={eventIndex}>
                {players.map((player, playerIndex) => (
                  <Td key={playerIndex}>
                    <Stack>
                      {event.historyLines
                        .filter(
                          (line) =>
                            line.player === player &&
                            line.designation !== GameLineType.PLAY_TURN,
                        )
                        .map((line, lineIndex) => (
                          <Flex key={lineIndex} fontSize="smaller">
                            <Text as="span">{line.designation}</Text>
                            <Spacer />
                            <Text as="span">
                              {line.amount === 0 ? '' : `${line.amount} pts`}
                            </Text>
                          </Flex>
                        ))}
                    </Stack>
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Center mt={6}>
        <Button
          leftIcon={<TbArrowBackUp />}
          variant="outline"
          colorScheme="orange"
          onClick={() => dispatch(cancelLastEventThunk())}
        >
          <Text whiteSpace="initial">Annuler la dernière action</Text>
        </Button>
      </Center>
    </>
  );
}
