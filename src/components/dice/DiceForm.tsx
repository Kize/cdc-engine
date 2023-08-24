import { JSX, useState } from 'react';
import { Stack } from '@chakra-ui/react';
import { DieValue } from '../../../lib/rule-runner/rules/dice-rule.ts';
import { DieInput } from './DieInput.tsx';

export type OptionalDieValue = DieValue | null;

export type DiceForm = [OptionalDieValue, OptionalDieValue, OptionalDieValue];

interface DiceFormProps {
  onChangeForm: (form: DiceForm) => void;
}

export function DiceForm({ onChangeForm }: DiceFormProps): JSX.Element {
  const [form, setForm] = useState([null, null, null] as DiceForm);

  const selectDie = (index: number) => (dieValue: OptionalDieValue) => {
    const newForm = [...form] as DiceForm;
    newForm[index] = dieValue;
    setForm(newForm);
    onChangeForm(newForm);
  };

  return (
    <Stack>
      {form.map((_, index) => (
        <DieInput key={index} selectValue={selectDie(index)} />
      ))}
    </Stack>
  );
}
