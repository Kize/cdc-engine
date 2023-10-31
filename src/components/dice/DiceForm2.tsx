import { JSX } from 'react';
import { Box, Icon, IconButton, SimpleGrid } from '@chakra-ui/react';
import { DieInput } from './DieInput.tsx';
import { DieShape } from './DieShape.tsx';
import { DiceForm, OptionalDieValue } from './dice-form.ts';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { RiDeleteBack2Line } from 'react-icons/ri';
import { useAppDispatch } from '../../store/store.ts';
import { resolversSlice } from '../../store/resolvers/resolvers.slice.ts';
import { IconType } from 'react-icons/lib/cjs/iconBase';

interface DiceFormProps {
  diceForm: DiceForm;
  onChangeForm: (form: DiceForm) => DiceForm;
}

export function DiceFormComponent2({
  diceForm,
  onChangeForm,
}: DiceFormProps): JSX.Element {
  const dispatch = useAppDispatch();

  const selectDie = (dieValue: OptionalDieValue): OptionalDieValue => {
    let hasStore = false;

    const newForm = diceForm.map<OptionalDieValue>((value) => {
      if (!hasStore && value === null) {
        hasStore = true;

        return dieValue;
      }

      return value;
    }) as DiceForm;

    onChangeForm(newForm);

    return null;
  };

  const deleteDie = (): void => {
    const newForm = diceForm.map<OptionalDieValue>((value, index) => {
      return diceForm[index + 1] === null ? null : value;
    }) as DiceForm;

    onChangeForm(newForm);
  };

  return (
    <Box>
      <SimpleGrid mx={0} my={2} columns={5} spacingX={2}>
        <IconButton
          boxSize="100%"
          aria-label="Ajouter des Opérations"
          icon={<Icon as={AiOutlinePlusCircle as IconType} boxSize="100%" />}
          bgColor="transparent"
          onClick={() =>
            dispatch(resolversSlice.actions.setAddOperations({ active: true }))
          }
        />

        {diceForm.map((dieValue, index) => (
          <Box
            key={index.toString()}
            p={1}
            bg="rgba(0, 0, 0, 0.1)"
            borderRadius="xl"
          >
            <DieShape dieValue={dieValue} />
          </Box>
        ))}

        <IconButton
          boxSize="100%"
          aria-label="Supprimer le dernier dé selectionné"
          icon={<Icon as={RiDeleteBack2Line as IconType} boxSize="100%" />}
          bgColor="transparent"
          onClick={() => deleteDie()}
        />
      </SimpleGrid>
      <DieInput dieValue={null} selectDie={selectDie} />
    </Box>
  );
}
