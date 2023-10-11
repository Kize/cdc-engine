import { JSX, useCallback } from 'react';
import {
  Box,
  Icon,
  useRadio,
  UseRadioGroupReturn,
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
import { DieValue } from '../../../lib/rule-runner/rules/dice-rule.ts';
import { IconType } from 'react-icons/lib/cjs/iconBase';
import './DieFace.css';
import classNames from 'classnames';

interface DieFaceProps extends UseRadioProps {
  dieValue: DieValue;
  disabled?: boolean;
}

export function DieFace(props: DieFaceProps): JSX.Element {
  const { getInputProps, getRadioProps, state } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  const handleSelect = useCallback(() => {
    if (props.isChecked && input.onChange) {
      (input.onChange as UseRadioGroupReturn['onChange'])('');
    }
  }, [input.onChange, props.isChecked]);

  const getDieIcon = (value: DieValue): IconType => {
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
    }
  };

  return (
    <Box as="label">
      <input
        {...input}
        disabled={props.disabled}
        onClick={handleSelect}
        onKeyDown={(e) => {
          if (e.key !== ' ') return;
          if (props.isChecked) {
            e.preventDefault();
            handleSelect();
          }
        }}
      />

      <Box
        {...checkbox}
        color="blue.300"
        className={classNames('die-transition', {
          'die-checked': state.isChecked,
          disabled: props.disabled,
        })}
        _checked={{
          color: 'blue.700',
        }}
      >
        <Icon as={getDieIcon(props.dieValue)} boxSize="100%" />
      </Box>
    </Box>
  );
}
