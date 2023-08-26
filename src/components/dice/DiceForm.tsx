import { JSX } from 'react';
import { Stack } from '@chakra-ui/react';
import { DieInput } from './DieInput.tsx';
import { DiceForm, OptionalDieValue } from './dice-form.ts';

interface DiceFormProps {
  diceForm: DiceForm;
  onChangeForm: (form: DiceForm) => DiceForm;
}

export function DiceFormComponent({
  diceForm,
  onChangeForm,
}: DiceFormProps): JSX.Element {
  const selectDie =
    (index: number) =>
    (dieValue: OptionalDieValue): OptionalDieValue => {
      const newForm = [...diceForm] as DiceForm;
      newForm[index] = dieValue;

      const updatedForm = onChangeForm(newForm);
      return updatedForm[index];
    };

  return (
    <Stack>
      {diceForm.map((dieValue, index) => (
        <DieInput
          key={index}
          dieValue={dieValue}
          selectDie={selectDie(index)}
        />
      ))}
    </Stack>
  );
}
