import { JSX } from 'react';
import {
  Center,
  Flex,
  Heading,
  Link,
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
import { useAppSelector } from '../../store/store.ts';
import {
  selectEvents,
  selectPlayers,
} from '../../store/current-game/current-game-selectors.ts';
import { GameLineType } from '../../../lib/history/history-line.ts';
import { Player } from '../../../lib/player.ts';
import { cdcGameHandler } from '../../utils/game-handler-configuration.ts';

export function CurrentGameHistory(): JSX.Element {
  const players = useAppSelector(selectPlayers);
  const events = useAppSelector(selectEvents);

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
          <Link href="/scribe-panel">Retour à la partie</Link>
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
    </>
  );
}
