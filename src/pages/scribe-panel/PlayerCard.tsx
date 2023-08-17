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

interface Player {
  name: string;
  score: number;
}

export function PlayerCard({ player }: { player: Player }): JSX.Element {
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
          >
            Bévue
          </Button>
        </Flex>
      </CardHeader>

      <CardBody px={3} py={1}>
        <Box as="span">This is the body</Box>
      </CardBody>
    </Card>
  );
}
