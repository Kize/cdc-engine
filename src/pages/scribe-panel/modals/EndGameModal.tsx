import { JSX } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store.ts';
import {
  Button,
  ButtonGroup,
  Center,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { resolversSlice } from '../../../store/resolvers/resolvers.slice.ts';
import {
  selectNumberOfTurns,
  selectPlayersWithSumScores,
} from '../../../store/current-game/current-game-selectors.ts';
import { useNavigate } from 'react-router-dom';
import { Player } from '../../../../lib/player.ts';

export interface PlayerWithSumScores {
  player: Player;
  score: number;
  positiveScore: number;
  negativeScore: number;
}

export function EndGameModal(): JSX.Element {
  const { active } = useAppSelector((state) => state.resolvers.endGame);
  const playerScores = useAppSelector(selectPlayersWithSumScores);
  const turnNumber = useAppSelector(selectNumberOfTurns);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const getRandomImage = () => {
    const imageNames = [
      'bed.gif',
      'clap.gif',
      'clap2.gif',
      'count.webp',
      'dance.gif',
      'strong.webp',
    ];
    const randomIndex = Math.floor(Math.random() * (imageNames.length - 1) + 1);

    return new URL(
      `../../../../public/${imageNames[randomIndex]}`,
      import.meta.url,
    ).href;
  };

  const onClose = () => {
    dispatch(resolversSlice.actions.setEndGame({ active: false }));
    navigate('/');
  };

  const onAddOperations = () => {
    dispatch(resolversSlice.actions.setAddOperations({ active: true }));
  };

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isOpen={active}
        size="4xl"
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>La partie est terminée !</ModalHeader>

          <ModalBody>
            <SimpleGrid columns={[1, 2]} spacingX={8} spacingY={4}>
              <TableContainer>
                <Table size="sm">
                  <TableCaption>
                    La partie a duré {turnNumber} tours.
                  </TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Joueurs</Th>
                      <Th>Scores</Th>
                      <Th>+</Th>
                      <Th>-</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {playerScores.map((details) => (
                      <Tr key={details.player}>
                        <Td>{details.player}</Td>
                        <Td textAlign="right" pr={[6, 12]}>
                          <Text as="b">{details.score} pts</Text>
                        </Td>
                        <Td>{details.positiveScore}</Td>
                        <Td>{details.negativeScore}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              <Center>
                <Image src={getRandomImage()} />
              </Center>
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup>
              <Button colorScheme="green" onClick={onAddOperations}>
                Ajouter des opérations
              </Button>

              <Button colorScheme="blue" onClick={onClose}>
                Terminer
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
