import { JSX } from 'react';
import {
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,

  Card,
  Flex,
  Text,
  Heading,
  Box,
  Button,
  CardBody,
  CardHeader,
  Spacer,
  Tag,
  TagLabel,
  TagLeftIcon,
  CardFooter,
  VStack,
} from '@chakra-ui/react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { useAppDispatch } from '../../../store/store.ts';
import { applyBevueThunk } from '../../../store/current-game/current-game-actions-thunks.ts';
import { Player } from '../../../../lib/player.ts';
import { FaRegBell } from 'react-icons/fa';
import { GiRabbit } from 'react-icons/gi';

export interface PlayerCardDetails {
  player: Player;
  score: number;
  isCurrentPlayer: boolean;
  hasGrelottine: boolean;
  hasCivet: boolean;
}

export function PlayerCard({
  details,
}: {
  details: PlayerCardDetails;
}): JSX.Element {
  const dispatch = useAppDispatch();

  const card_detail = (
    <Flex direction="row" alignItems="baseline">
      <Box as="span" fontSize="3xl" fontWeight="light">{details.score}</Box>
      <Box as="span" pt={2.5} fontWeight="light" verticalAlign="bottom">&nbsp;pts</Box>
      <Spacer />
      <Tag colorScheme="red" hidden={!details.hasGrelottine}>
        <TagLeftIcon as={FaRegBell} />
        <TagLabel>Grelottine</TagLabel>
      </Tag>
      <Tag colorScheme="gray" hidden={!details.hasCivet}>
        <TagLeftIcon as={GiRabbit} />
        <TagLabel>Civet</TagLabel>
      </Tag>
    </Flex>
  )

  return (
    <Popover>
      <PopoverTrigger>
        <Card
          variant="filled"
          bgColor={details.isCurrentPlayer ? 'blue.100' : 'blue.50'}
        >
          <CardHeader px={3} py={1}>
            {card_detail}
          </CardHeader>

          <CardBody px={3} /*py={[1, 3]}*/ py={0}>
            <Text
              width="100%"
              fontSize="2xl"
              fontWeight="light"
              align="center"
            >
              {details.player}
            </Text>
          </CardBody>

          <CardFooter display="block" px={3} py={1} transform="rotate(180deg)">
            {card_detail}
          </CardFooter>
        </Card>
      </PopoverTrigger>

      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>
            <VStack>
              <Button
                width="100%"
                aria-label="Bévue"
                colorScheme="red"
                leftIcon={<AiOutlineExclamationCircle />}
                onClick={() => dispatch(applyBevueThunk(details.player))}
              >
                Bévue
              </Button>
              <Button
                width="100%"
                aria-label="Défi grelottine…"
                colorScheme="gray"
                leftIcon={<AiOutlineExclamationCircle />}
              //onClick = {() => dispatch(applyBevueThunk(details.player))}
              >
                Défi grelottine…
              </Button>
              <Button
                width="100%"
                aria-label="Abandon de popste"
                colorScheme="gray"
                leftIcon={<AiOutlineExclamationCircle />}
              //onClick = {() => dispatch(applyBevueThunk(details.player))}
              >
                Abandon de popste, OMG !
              </Button>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Portal>

    </Popover>
  );
}
