import { JSX } from 'react';
import {
  Box,
  Button,
  Icon,
  IconButton,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { useAppDispatch } from '../../../store/store.ts';
import {
  applyBevueThunk,
  playATurnThunk,
  startGrelottineChallengeThunk,
} from '../../../store/current-game/current-game-actions-thunks.ts';
import { Player } from '../../../../lib/player.ts';
import { FaRegBell } from 'react-icons/fa';
import { GiRabbit } from 'react-icons/gi';
import { IconType } from 'react-icons/lib/cjs/iconBase';
import { GameContextEvent } from '../../../../lib/rule-runner/game-context-event.ts';

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

  const triggerGrelottine = async () => {
    if (hasGrelottine && score > 0) {
      await dispatch(startGrelottineChallengeThunk());
    }
  };

  const triggerCivet = async () => {
    if (isCurrentPlayer && hasCivet) {
      await dispatch(playATurnThunk({ event: GameContextEvent.CIVET_BET }));
    }
  };

  return (
    <SimpleGrid
      columns={4}
      bgColor={isCurrentPlayer ? 'blue.100' : 'blue.50'}
      p={2}
    >
      <Box as="span" fontSize={'1.4em'} maxH={'1.8em'} overflowX="hidden">
        {player}
      </Box>

      <Box as="b" fontSize={'1.2em'}>
        {score}pts
      </Box>

      <Stack direction="row" spacing={2}>
        <IconButton
          aria-label="jouer une grelottine"
          pt={1}
          boxSize={'2em'}
          icon={<Icon as={FaRegBell as IconType} boxSize="120%" />}
          variant="ghost"
          isDisabled={!hasGrelottine || score <= 0}
          colorScheme={hasGrelottine ? 'red' : 'whiteAlpha'}
          onClick={triggerGrelottine}
        />

        <IconButton
          aria-label="jouer son civet"
          pt={1}
          boxSize={'2em'}
          icon={<Icon as={GiRabbit as IconType} boxSize="120%" />}
          variant="ghost"
          isDisabled={!isCurrentPlayer || !hasCivet}
          colorScheme={hasCivet ? 'green' : 'whiteAlpha'}
          onClick={triggerCivet}
        />
      </Stack>

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
