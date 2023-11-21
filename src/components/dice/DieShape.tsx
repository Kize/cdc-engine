import { JSX } from 'react';
import { Box, Icon } from '@chakra-ui/react';
import {
  BsDice1,
  BsDice2,
  BsDice3,
  BsDice4,
  BsDice5,
  BsDice6,
} from 'react-icons/bs';
import { CiSquareQuestion } from 'react-icons/ci';
import { IconType } from 'react-icons/lib/cjs/iconBase';
import './DieFace.css';
import { OptionalDieValue } from './dice-form.ts';

interface Props {
  dieValue: OptionalDieValue;
}

export function DieShape({ dieValue }: Props): JSX.Element {
  if (dieValue === null) {
    return <Box></Box>;
  }

  const getDieIcon = (value: OptionalDieValue): IconType => {
    switch (value) {
      case 1:
        return BsDice1 as IconType;
      case 2:
        return BsDice2 as IconType;
      case 3:
        return BsDice3 as IconType;
      case 4:
        return BsDice4 as IconType;
      case 5:
        return BsDice5 as IconType;
      case 6:
        return BsDice6 as IconType;
      default:
        return CiSquareQuestion as IconType;
    }
  };

  return (
    <Icon
      //m={0}
      //p={0}
      boxSize="100%"
      as={getDieIcon(dieValue)}
      color="blue.400"
    />
  );
}
