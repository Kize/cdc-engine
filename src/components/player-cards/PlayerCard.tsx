import { JSX } from 'react';
import { Box, Button, SimpleGrid } from '@chakra-ui/react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { useAppDispatch } from '../../store/store.ts';
import { applyBevueThunk } from '../../store/current-game/current-game-actions-thunks.ts';
import { PlayerCardDetails } from './player-card-details.ts';
import { PlayerStatuses } from './PlayerStatuses.tsx';

export function PlayerCard({
  details,
}: {
  details: PlayerCardDetails;
}): JSX.Element {
  const dispatch = useAppDispatch();

  const boxTextStyle = {
    my: 'auto',
    fontSize: '1.2em',
  };

  return (
    <SimpleGrid
      columns={4}
      bgColor={details.isCurrentPlayer ? 'blue.100' : 'blue.50'}
      borderRadius="md"
    >
      <Box
        as="span"
        maxH={'1.8em'}
        overflowX="hidden"
        {...boxTextStyle}
        px={[1, 3]}
      >
        {details.player}
      </Box>

      <Box as="b" {...boxTextStyle}>
        {details.score}pts
      </Box>

      <PlayerStatuses details={details} />

      <Button
        aria-label="Bévue"
        colorScheme="red"
        variant="outline"
        leftIcon={<AiOutlineExclamationCircle />}
        onClick={() => dispatch(applyBevueThunk(details.player))}
        m={2}
      >
        bévue
      </Button>
    </SimpleGrid>
  );
}
