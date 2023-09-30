import { JSX, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Icon,
  IconButton
} from '@chakra-ui/react';
import { DieInput } from './DieInput.tsx';
import { DieShape } from './DieShape.tsx';
import { DiceForm, OptionalDieValue } from './dice-form.ts';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { RiDeleteBack2Line } from 'react-icons/ri';
import { useAppDispatch } from '../../store/store.ts';
import { resolversSlice } from '../../store/resolvers/resolvers.slice.ts';

interface DiceFormProps {
  diceForm: DiceForm;
  onChangeForm: (form: DiceForm) => DiceForm;
}

export function DiceFormComponent2({
  diceForm,
  onChangeForm,
}: DiceFormProps): JSX.Element {

  const dispatch = useAppDispatch();

  //const [dieValue, setDieValue] = useState<OptionalDieValue>(null)
  //const [dieValue] = useState<OptionalDieValue>(null)
  const dieValue: OptionalDieValue = null

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

  function deleteDie() {
    const newForm: DiceForm = diceForm.map((value, index) => {
      if (diceForm[index + 1] === null) {
        return null
      } else {
        return value
      }
    })
    onChangeForm(newForm)
  }

  return (
    <Box>
      <Box display="none">diceForm {diceForm}</Box>
      <SimpleGrid mx={0} my={2} columns={5} spacingX={2} >
        <IconButton
          boxSize="100%"
          aria-label="Ajouter des Opérations"
          icon={<Icon as={AiOutlinePlusCircle} boxSize="100%" />}
          bgColor="transparent"
          onClick={() =>
            dispatch(
              resolversSlice.actions.setAddOperations({ active: true }),
            )
          }
        />
        {diceForm.map((dieValue, index) => (
          <Box
            key={index.toString()}
            p={1}
            bg="rgba(0, 0, 0, 0.1)"
            borderRadius="xl"
          >
            <DieShape
              dieValue={dieValue}
            />
          </Box>
        ))}
        <IconButton
          boxSize="100%"
          aria-label="Supprimer le dernier dé selectionné"
          icon={<Icon as={RiDeleteBack2Line} boxSize="100%" />}
          bgColor="transparent"
          onClick={() => deleteDie()}
        />
      </SimpleGrid>
      <DieInput
        dieValue={dieValue}
        selectDie={selectDie}
      />
    </Box>
  )

}
