import { JSX } from 'react';
import { Box, Button, Icon, SimpleGrid } from '@chakra-ui/react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { useAppDispatch } from '../../../store/store.ts';
import { applyBevueThunk } from '../../../store/current-game/current-game-actions-thunks.ts';
import { Player } from '../../../../lib/player.ts';
import { FaRegBell } from 'react-icons/fa';
import { GiRabbit } from 'react-icons/gi';
import { IconType } from 'react-icons/lib/cjs/iconBase';

export interface PlayerCardDetails {
  player: Player;
  score: number;
  isCurrentPlayer: boolean;
  hasGrelottine: boolean;
  hasCivet: boolean;
}

export function PlayerCard({
  details: { hasCivet, hasGrelottine, isCurrentPlayer, player, score },
}: {
  details: PlayerCardDetails;
}): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <SimpleGrid
      columns={4}
      bgColor={isCurrentPlayer ? 'blue.100' : 'blue.50'}
      p={2}
    >
      <Box as="span" fontSize={'1.25em'} maxH={'1.5em'} overflowX="hidden">
        {player}
      </Box>

      <Box as="b" fontSize={'1.2em'}>
        {score}pts
      </Box>

      <Box>
        <Icon
          boxSize={'2em'}
          as={FaRegBell as IconType}
          color={hasGrelottine ? 'red' : 'lightgrey'}
        />
        <Icon
          boxSize={'2em'}
          as={GiRabbit as IconType}
          color={hasCivet ? 'green' : 'lightgrey'}
        />
      </Box>

      <Button
        aria-label="Bévue"
        colorScheme="red"
        variant="outline"
        leftIcon={<AiOutlineExclamationCircle />}
        onClick={() => dispatch(applyBevueThunk(player))}
      >
        Bévue
      </Button>
    </SimpleGrid>
  );
}
