import { JSX, useCallback } from 'react';
import {
  Box,
  Icon,
  UseRadioProps,
} from '@chakra-ui/react';
import {
  BsDice1,
  BsDice2,
  BsDice3,
  BsDice4,
  BsDice5,
  BsDice6,
} from 'react-icons/bs';
import { DieValue } from '../../../lib/rule-runner/rules/dice-rule.js';
import { IconType } from 'react-icons/lib/cjs/iconBase';
import './DieFace.css';

export function DieShape(
  dieValue2: DieValue
): JSX.Element {
  const getDieIcon = (value: DieValue): IconType => {
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
    }
  };

  return (
    <Box as="label">
      <Box
        color="blue.400"
        className="die-transition"
        _checked={{
          color: 'blue.600',
        }}
      >
        <Icon as={getDieIcon(dieValue2)} boxSize="100%" />
      </Box>
    </Box>
  );
}
