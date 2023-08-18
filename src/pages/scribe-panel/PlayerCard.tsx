import { JSX } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../../store.ts';
import { increment, selectCount } from '../../slices/counter.ts';

interface Player {
  name: string;
  score: number;
}

export function PlayerCard({ player }: { player: Player }): JSX.Element {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();

  return (
    <Card variant="filled">
      <CardHeader px={3} py={1}>
        <Flex>
          <Box as="span">{player.name}</Box>
          <Spacer />

          <Box as="u">{player.score} points</Box>
          <Spacer />

          <Button
            aria-label="Bévue"
            colorScheme="red"
            variant="outline"
            size="xs"
            leftIcon={<AiOutlineExclamationCircle />}
            onClick={() => dispatch(increment())}
          >
            Bévue
          </Button>
        </Flex>
      </CardHeader>

      <CardBody px={3} py={1}>
        <Box as="span">{count}</Box>
      </CardBody>
    </Card>
  );
}
