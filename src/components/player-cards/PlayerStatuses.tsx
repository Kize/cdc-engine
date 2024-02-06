import { PlayerCardDetails } from './player-card-details.ts';
import { JSX } from 'react';
import { useAppDispatch } from '../../store/store.ts';
import {
  playATurnThunk,
  startGrelottineChallengeThunk,
} from '../../store/current-game/current-game-actions-thunks.ts';
import { GameContextEvent } from '../../../lib/rule-runner/game-context-event.ts';
import { Icon, IconButton, Stack } from '@chakra-ui/react';
import { FaRegBell } from 'react-icons/fa';
import { IconType } from 'react-icons/lib/cjs/iconBase';
import { GiRabbit } from 'react-icons/gi';

export function PlayerStatuses({
  details,
}: {
  details: PlayerCardDetails;
}): JSX.Element {
  const dispatch = useAppDispatch();

  const triggerGrelottine = async () => {
    if (details.hasGrelottine && details.score > 0) {
      await dispatch(startGrelottineChallengeThunk());
    }
  };

  const triggerCivet = async () => {
    if (details.isCurrentPlayer && details.hasCivet) {
      await dispatch(playATurnThunk({ event: GameContextEvent.CIVET_BET }));
    }
  };

  return (
    <Stack direction="row" spacing={2} mt={2}>
      <IconButton
        aria-label="jouer une grelottine"
        icon={<Icon as={FaRegBell as IconType} boxSize="100%" />}
        variant="ghost"
        isDisabled={!details.hasGrelottine || details.score <= 0}
        colorScheme={details.hasGrelottine ? 'red' : 'whiteAlpha'}
        onClick={triggerGrelottine}
      />

      <IconButton
        aria-label="jouer son civet"
        icon={<Icon as={GiRabbit as IconType} boxSize="100%" />}
        variant="ghost"
        isDisabled={!details.isCurrentPlayer || !details.hasCivet}
        colorScheme={details.hasCivet ? 'green' : 'whiteAlpha'}
        onClick={triggerCivet}
      />
    </Stack>
  );
}
