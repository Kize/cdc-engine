import { JSX } from 'react';
import { HStack, useRadioGroup } from '@chakra-ui/react';
import { DieFace } from './DieFace.tsx';
import { DieValue } from '../../../lib/rule-runner/rules/dice-rule.ts';
import { OptionalDieValue } from './DiceForm.tsx';

interface DieInputProps {
  defaultValue?: DieValue;
  selectValue: (dieValue: OptionalDieValue) => void;
}

export function DieInput({
  selectValue,
  defaultValue,
}: DieInputProps): JSX.Element {
  const options: Array<DieValue> = [1, 2, 3, 4, 5, 6];

  const onChange = (nextValue: string) => {
    const dieValue =
      nextValue === '' ? null : (parseInt(nextValue) as DieValue);

    selectValue(dieValue);
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'DieInput',
    defaultValue: defaultValue ? defaultValue.toString() : '',
    onChange,
  });

  return (
    <HStack {...getRootProps()}>
      {options.map((value) => {
        const radio = getRadioProps({ value: value.toString() });
        return <DieFace key={value.toString()} dieValue={value} {...radio} />;
      })}
    </HStack>
  );
}
