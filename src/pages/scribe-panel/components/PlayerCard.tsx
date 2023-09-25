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
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { useAppDispatch } from '../../../store/store.ts';
import { applyBevueThunk } from '../../../store/current-game/current-game-actions-thunks.ts';
import { Player } from '../../../../lib/player.ts';
import { FaRegBell } from 'react-icons/fa';
import { GiRabbit, GiWhistle } from 'react-icons/gi';
import { BiRun } from 'react-icons/bi';

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
    <Menu>
      <MenuButton as={Box}>
        <Card
          variant="filled"
          bgColor={details.isCurrentPlayer ? "blue.50" : "#F9EDC4"}
          bgGradient={details.isCurrentPlayer ? "linear(#FFCC6A, #FFE4B8 25%, #9E8426)" : ""}
        //bgImage="../../../../public/abstract-gold-leather-textures-free-photo.jpg"
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
            //textShadow='0px 0px 3px #FFFFFF'
            >
              {details.player}
            </Text>
          </CardBody>

          <CardFooter display="block" px={3} py={1} opacity={0.5} transform="rotate(180deg)">
            {card_detail}
          </CardFooter>
        </Card>
      </MenuButton>
      <MenuList>
        <MenuItem icon={<GiWhistle />} onClick={() => dispatch(applyBevueThunk(details.player))}>
          Bévue</MenuItem>
        <MenuItem icon={<FaRegBell />}>
          Défi grelottine…</MenuItem>
        <MenuItem icon={<BiRun />}>
          Abandon de popste, OMG !</MenuItem>
      </MenuList>
    </Menu>
  );
}
