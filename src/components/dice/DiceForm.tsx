import { JSX } from 'react';
import { HStack, useRadioGroup } from '@chakra-ui/react';
import { DieInput } from './DieInput.tsx';
import { DieValue } from '../../../lib/rule-runner/rules/dice-rule.ts';

interface DiceFormProps {
  defaultValue?: DieValue;
  selectValue: (dieValue: DieValue | null) => void;
}

export function DiceForm({
  selectValue,
  defaultValue,
}: DiceFormProps): JSX.Element {
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
        return (
          <DieInput
            key={value.toString()}
            dieValue={value}
            {...radio}
            // onClick={onClick}
          />
        );
      })}
    </HStack>
  );
}
