import { JSX, useEffect } from 'react';
import { SimpleGrid, useRadioGroup } from '@chakra-ui/react';
import { DieFace } from './DieFace.tsx';
import { DieValue } from '../../../lib/rule-runner/rules/dice-rule.ts';
import { OptionalDieValue } from './dice-form.ts';

interface DieInputProps {
  dieValue: OptionalDieValue;
  selectDie: (dieValue: OptionalDieValue) => OptionalDieValue;
}

export function DieInput({ dieValue, selectDie }: DieInputProps): JSX.Element {
  const options: Array<DieValue> = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    setTimeout(() => {
      setValue(dieValue ? dieValue.toString() : '');
    }, 200);
  }, [dieValue]);

  const onChange = (nextValue: string) => {
    const dieValue =
      nextValue === '' ? null : (parseInt(nextValue) as DieValue);

    const newValue = selectDie(dieValue);

    setTimeout(() => {
      setValue(newValue ? newValue.toString() : '');
    }, 200);
  };

  const { getRootProps, getRadioProps, setValue } = useRadioGroup({
    name: 'DieInput',
    defaultValue: '',
    onChange,
  });

  return (
    <SimpleGrid columns={6} spacingX={2} mx={2} {...getRootProps()}>
      {options.map((value) => {
        const radio = getRadioProps({ value: value.toString() });
        return <DieFace key={value.toString()} dieValue={value} {...radio} />;
      })}
    </SimpleGrid>
  );
}
