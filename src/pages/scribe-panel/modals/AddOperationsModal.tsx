import { JSX, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store.ts';
import {
  Button,
  Card,
  Center,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Stack,
  useBoolean,
} from '@chakra-ui/react';
import { RuleEffectEvent } from '../../../../lib/rule-runner/rules/rule-effect.ts';
import { Select } from 'chakra-react-select';
import { selectPlayers } from '../../../store/current-game/current-game-selectors.ts';
import { resolversSlice } from '../../../store/resolvers/resolvers.slice.ts';
import { CustomSelectOption } from '../../../utils/custom-select.utils.ts';
import { Player } from '../../../../lib/player.ts';
import { AddOperationLinesContext } from '../../../../lib/game/add-operations.ts';
import { addOperationsThunk } from '../../../store/current-game/current-game-thunks.ts';
import {
  GodModLineType,
  HistoryLine,
} from '../../../../lib/history/history-line.ts';

interface OperationLineForm {
  player: Player;
  amount: number;
  options: Array<RuleEffectEvent>;
}

const toNewLineForm = (player: Player): OperationLineForm => ({
  player: player,
  options: [],
  amount: 0,
});

export function AddOperationsModal(): JSX.Element {
  const { active } = useAppSelector((state) => state.resolvers.addOperations);
  const players = useAppSelector(selectPlayers);
  const dispatch = useAppDispatch();
  const [lineForms, setLineForms] = useState<Array<OperationLineForm>>(
    players.map<OperationLineForm>(toNewLineForm),
  );
  const [shouldHandleEndTurn, { off, toggle }] = useBoolean(false);

  const updateLineForm = (index: number) => (lineForm: OperationLineForm) => {
    const newLineForms = lineForms.map((line, i) => {
      if (i === index) {
        return { ...lineForm };
      }
      return { ...line };
    });

    setLineForms(newLineForms);
  };

  const resetForm = () => {
    setLineForms(players.map(toNewLineForm));
    off();
  };

  const onClose = () => {
    dispatch(resolversSlice.actions.setAddOperations({ active: false }));
    resetForm();
  };

  const onValidate = () => {
    const context: AddOperationLinesContext = {
      shouldHandleEndTurn,
      operations: lineForms.reduce<Array<HistoryLine>>(
        (operations, currentLine) => {
          const mainLineActionPayload: Array<HistoryLine> = [];
          if (currentLine.amount) {
            mainLineActionPayload.push({
              designation: GodModLineType.GOD_MOD,
              player: currentLine.player,
              amount: currentLine.amount,
            });
          }

          const optionActionPayloads = currentLine.options.map<HistoryLine>(
            (optionDesignation) => ({
              designation: optionDesignation,
              player: currentLine.player,
              amount: 0,
            }),
          );

          return [
            ...operations,
            ...mainLineActionPayload,
            ...optionActionPayloads,
          ];
        },
        [],
      ),
    };

    dispatch(addOperationsThunk(context));
    resetForm();
  };

  return (
    <>
      <Modal size="full" isOpen={active} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader color="white" bgColor="green.400">
            Ajouter des opérations
          </ModalHeader>

          <ModalBody>
            <Stack>
              <Center>
                <Checkbox
                  size="lg"
                  isChecked={shouldHandleEndTurn}
                  onChange={toggle}
                >
                  Passer le tour
                </Checkbox>
              </Center>

              {lineForms.map((lineForm, index) => (
                <LineForm
                  key={index}
                  lineForm={lineForm}
                  setLineForm={updateLineForm(index)}
                />
              ))}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onValidate}>
              Valider
            </Button>
            <Button onClick={onClose}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

interface LineFormProps {
  lineForm: OperationLineForm;
  setLineForm: (line: OperationLineForm) => void;
}

function LineForm({ lineForm, setLineForm }: LineFormProps): JSX.Element {
  const options: Array<CustomSelectOption> = [
    {
      label: RuleEffectEvent.ADD_GRELOTTINE,
      value: RuleEffectEvent.ADD_GRELOTTINE,
    },
    {
      label: RuleEffectEvent.REMOVE_GRELOTTINE,
      value: RuleEffectEvent.REMOVE_GRELOTTINE,
    },
    {
      label: RuleEffectEvent.ADD_CIVET,
      value: RuleEffectEvent.ADD_CIVET,
    },
    {
      label: RuleEffectEvent.REMOVE_CIVET,
      value: RuleEffectEvent.REMOVE_CIVET,
    },
    {
      label: RuleEffectEvent.ADD_JARRET,
      value: RuleEffectEvent.ADD_JARRET,
    },
    {
      label: RuleEffectEvent.REMOVE_JARRET,
      value: RuleEffectEvent.REMOVE_JARRET,
    },
  ];

  const setAmount = (value: number): void => {
    const newLine = { ...lineForm, amount: value };

    setLineForm(newLine);
  };

  const optionsForm = lineForm.options.map<CustomSelectOption>((line) => {
    return {
      label: line,
      value: line,
    };
  });

  const onChangeOptions = (items: Array<CustomSelectOption>) => {
    const newLine = {
      ...lineForm,
      options: items.map((i) => i.value as RuleEffectEvent),
    };

    setLineForm(newLine);
  };

  return (
    <Card p={3}>
      <SimpleGrid columns={[1, 3]} spacingX={[2, 10]}>
        <Center>
          <Heading size="sm">{lineForm.player}</Heading>
        </Center>

        <FormControl>
          <FormLabel fontSize="xs">Options</FormLabel>

          <Select
            isMulti
            name="options"
            options={options}
            value={optionsForm}
            onChange={(items) => onChangeOptions([...items])}
            placeholder="Ajout / retrait de grelottine, civet, etc..."
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="xs">Montant</FormLabel>

          <NumberInput
            value={lineForm.amount}
            onChange={(_, value) => setAmount(value)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </SimpleGrid>
    </Card>
  );
}
