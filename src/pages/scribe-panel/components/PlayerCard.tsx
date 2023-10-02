import { JSX } from 'react';
import {
  Card,
  Flex,
  Text,
  Box,
  CardBody,
  CardHeader,
  Spacer,
  Tag,
  TagLabel,
  TagLeftIcon,
  CardFooter
} from '@chakra-ui/react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
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
  const dispatch = useAppDispatch()

  function random_hue(str) {
    //https://www.30secondsofcode.org/js/s/hash-string-into-number/
    let arr = str.split('');
    let random_numb = arr.reduce(
      (hashCode, currentVal) =>
      (hashCode =
        currentVal.charCodeAt(0) +
        (hashCode << 6) +
        (hashCode << 16) -
        hashCode),
      0
    )
    let random_hue = Math.abs(random_numb % 360)
    return random_hue
  }
  const random_color = random_hue(details.player)

  const card_detail = ((isCurrentPlayer) => (
    <Flex direction="row" alignItems="baseline">
      <Box
        as="span"
        fontSize="3xl" 
        fontWeight="normal"
        color={details.isCurrentPlayer ? "white" : "black"}
      >
        {details.score}
      </Box>
      <Box 
        as="span" pt={2.5} 
        fontWeight="light" 
        verticalAlign="bottom"
        color={details.isCurrentPlayer ? "white" : "black"}
      >
        &nbsp;pts
      </Box>
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
  ))

  return (
    <Menu>
      <MenuButton as={Box}>
        <Card
          variant="filled"
          //bgColor={details.isCurrentPlayer ? "blue.50" : "#F9EDC4"}
          //bgGradient={details.isCurrentPlayer ? "linear(#FFCC6A, #FFE4B8 25%, #9E8426)" : ""}
          bgColor={"hsl(" + random_color + ", 60%, 90%)"}
          bgGradient={details.isCurrentPlayer
            /*
            ? "linear(#FFCC6A, #FFE4B8 25%, #9E8426)"
            /*/
            ? "linear(" +
            "hsl(" + random_color + ", 60%, 90%)," +
            "hsl(" + random_color + ", 60%, 80%) 25%," +
            "hsl(" + random_color + ", 60%, 30%)" +
            ")"
            /**/
            : ""}
        //bgImage="../../../../public/abstract-gold-leather-textures-free-photo.jpg"
        >
          {/*
          <CardHeader px={3} py={1}>
            {card_detail}
            {details.player}
          </CardHeader>
          /**/}

          <CardHeader px={3} py={1}>
            <Text
              width="100%"
              pt={2}
              fontSize={["xl", "2xl", "2xl"]}
              fontWeight="light"
              align="center"
              lineHeight={1}
            >
              {details.player}
            </Text>
          </CardHeader>

          {/** /}
          <CardBody px={0} py={0}>
            <Text
              width="100%"
              fontSize={["xl", "2xl", "2xl"]}
              fontWeight="light"
              align="center"
              lineHeight={1}
            >
              {details.player}
              {/** /}<br />{random_hue(details.player)}{/*//*/}
            </Text>
          </CardBody>
          {/**/}

          <CardFooter display="block" px={3} py={0}/*py={1} opacity={0.5} transform="rotate(180deg)*/>
            {card_detail(details.isCurrentPlayer)}
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
