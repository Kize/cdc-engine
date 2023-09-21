import { JSX, useCallback } from 'react';
import {
  Box,
  Icon
} from '@chakra-ui/react';
import {
  BsDice1,
  BsDice2,
  BsDice3,
  BsDice4,
  BsDice5,
  BsDice6,
} from 'react-icons/bs';
import { CiSquareQuestion } from 'react-icons/ci';
import { DieValue } from '../../../lib/rule-runner/rules/dice-rule.js';
import { OptionalDieValue } from './dice-form.js';
import { IconType } from 'react-icons/lib/cjs/iconBase';
import './DieFace.css';

interface FuckYou {
  dieValue: OptionalDieValue
}

export function DieShape({
  dieValue
}: FuckYou): JSX.Element {

  if (dieValue === null) {
    return <Box></Box>
  }

  //const getDieIcon = (value: DieValue): IconType => {
  const getDieIcon = (value: OptionalDieValue): IconType => {
    switch (value) {
      case 1:
        return BsDice1;
      case 2:
        return BsDice2;
      case 3:
        return BsDice3;
      case 4:
        return BsDice4;
      case 5:
        return BsDice5;
      case 6:
        return BsDice6;
      default:
        return CiSquareQuestion
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
  )

}
