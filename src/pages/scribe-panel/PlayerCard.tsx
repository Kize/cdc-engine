import { JSX } from 'react';
import { Box, Button, Card, CardHeader, Flex, Spacer } from '@chakra-ui/react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { useAppDispatch } from '../../store/store.ts';
import { applyBevueThunk } from '../../store/current-game/current-game-thunks.ts';
import { Player } from '../../../lib/player.ts';

export function PlayerCard({
  player,
  score,
}: {
  player: Player;
  score: number;
}): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <Card variant="filled">
      <CardHeader px={3} py={1}>
        <Flex>
          <Box as="span">{player}</Box>
          <Spacer />

          <Box as="u">{score} points</Box>
          <Spacer />

          <Button
            aria-label="Bévue"
            colorScheme="red"
            variant="outline"
            size="xs"
            leftIcon={<AiOutlineExclamationCircle />}
            onClick={() => dispatch(applyBevueThunk(player))}
          >
            Bévue
          </Button>
        </Flex>
      </CardHeader>
    </Card>
  );
}
