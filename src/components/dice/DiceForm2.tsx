import { JSX, useState } from 'react';
import { Box, SimpleGrid, Icon } from '@chakra-ui/react';
import { DieInput } from './DieInput.tsx';
import { DieShape } from './DieShape.tsx';
import { DiceForm, OptionalDieValue } from './dice-form.ts';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { RiDeleteBack2Line } from 'react-icons/ri';

interface DiceFormProps {
  diceForm: DiceForm;
  onChangeForm: (form: DiceForm) => DiceForm;
}

export function DiceFormComponent2({
  diceForm,
  onChangeForm,
}: DiceFormProps): JSX.Element {

  const [dieValue] = useState<OptionalDieValue>(null)

  const selectDie = (dieValue: OptionalDieValue): OptionalDieValue => {

    let hasStore = false


    const newForm: DiceForm = diceForm.map((value) => {
      if (!hasStore && value === null) {
        hasStore = true
        return dieValue
      }
      return value
    })

    onChangeForm(newForm)


    return null
  }

  return (
    <Box>
      <p>
        {diceForm}
      </p>
      <SimpleGrid columns={5} spacingX={2} mx={2} >
        <Icon as={AiOutlinePlusCircle} boxSize="100%" />
        {diceForm.map((dieValue, index) => (
          <DieShape
            key={index}
            dieValue2={dieValue}
          />
        ))}
        <Icon as={RiDeleteBack2Line} boxSize="100%" />
      </SimpleGrid>
      <DieInput
        dieValue={dieValue}
        selectDie={selectDie}
      />
    </Box>
  );
}
