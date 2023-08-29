import { JSX } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Spacer,
  Tag,
  TagLabel,
  TagLeftIcon,
} from '@chakra-ui/react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { useAppDispatch } from '../../../store/store.ts';
import { applyBevueThunk } from '../../../store/current-game/current-game-actions-thunks.ts';
import { Player } from '../../../../lib/player.ts';
import { FaRegBell } from 'react-icons/fa';

export interface PlayerCardDetails {
  player: Player;
  score: number;
  isCurrentPlayer: boolean;
  hasGrelottine: boolean;
}

export function PlayerCard({
  details,
}: {
  details: PlayerCardDetails;
}): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <Card
      variant="filled"
      bgColor={details.isCurrentPlayer ? 'blue.100' : 'blue.50'}
    >
      <CardHeader px={3} py={1}>
        <Flex>
          <Box as="span">{details.player}</Box>
          <Spacer />

          <Box as="u">{details.score} points</Box>
          <Spacer />

          <Button
            aria-label="Bévue"
            colorScheme="red"
            variant="outline"
            size="xs"
            leftIcon={<AiOutlineExclamationCircle />}
            onClick={() => dispatch(applyBevueThunk(details.player))}
          >
            Bévue
          </Button>
        </Flex>
      </CardHeader>

      <CardBody px={3} py={[1, 3]}>
        <Tag colorScheme="red" hidden={!details.hasGrelottine}>
          <TagLeftIcon as={FaRegBell} />
          <TagLabel>Grelottine</TagLabel>
        </Tag>{' '}
      </CardBody>
    </Card>
  );
}
