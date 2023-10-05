import { JSX, useState } from 'react';
import { useAppSelector } from '../../../../store/store.ts';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Center,
  FormControl,
  FormLabel,
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
} from '@chakra-ui/react';
import { DiceFormComponent } from '../../../../components/dice/DiceForm.tsx';
import {
  DiceForm,
  getNewDiceForm,
  isDiceFormValid,
} from '../../../../components/dice/dice-form.ts';
import { civetRuleResolver } from '../../../../store/resolvers/rules/civet-rule.resolver.ts';
import { CivetBet } from '../../../../../lib/rule-runner/rules/level-1/civet-rule.ts';
import { Select } from 'chakra-react-select';
import {
  CustomSelectOption,
  customSelectStyles,
} from '../../../../utils/custom-select.utils.ts';

export function CivetModalResolver(): JSX.Element {
  const { active, player } = useAppSelector((state) => state.resolvers.civet);

  const [selectedBet, setSelectedBet] = useState<CustomSelectOption | null>(
    null,
  );
  const [amount, setAmount] = useState<number>(102);
  const [diceForm, setDiceForm] = useState<DiceForm>(getNewDiceForm());

  const options = Object.values(CivetBet).map<CustomSelectOption>((value) => ({
    label: value,
    value,
  }));

  const isFormValid = selectedBet !== null && isDiceFormValid(diceForm);

  const resetForm = () => {
    setDiceForm(getNewDiceForm());
    setAmount(102);
    setSelectedBet(null);
  };

  const onClose = () => {
    civetRuleResolver.reject();
    resetForm();
  };

  const onValidate = () => {
    if (isFormValid) {
      civetRuleResolver.resolve({
        isVerdier: false,
        playerBet: selectedBet.value as CivetBet,
        diceRoll: diceForm,
        betAmount: amount,
      });
      resetForm();
    }
  };

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isOpen={active}
        size="xl"
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>{player} utilise son Civet</ModalHeader>

          <ModalBody>
            <Card mb={6}>
              <CardHeader fontSize="sm" py={2}>
                Annonce:
              </CardHeader>

              <CardBody pt={0}>
                <SimpleGrid columns={2}>
                  <FormControl>
                    <FormLabel fontSize="xs">Défi:</FormLabel>

                    <Select
                      placeholder={options[0]?.label ?? ''}
                      value={selectedBet}
                      options={options}
                      onChange={setSelectedBet}
                      {...customSelectStyles}
                    />
                  </FormControl>

                  <Center>
                    <FormControl w="initial">
                      <FormLabel fontSize="xs">Montant</FormLabel>

                      <NumberInput
                        maxW={24}
                        min={1}
                        max={102}
                        value={amount}
                        onChange={(_, value) => setAmount(value)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </Center>
                </SimpleGrid>
              </CardBody>
            </Card>

            <Card>
              <CardHeader fontSize="sm" py={2}>
                Combinaison réalisée:
              </CardHeader>

              <CardBody py={0}>
                <DiceFormComponent
                  diceForm={diceForm}
                  onChangeForm={(diceForm) => {
                    setDiceForm(diceForm);
                    return diceForm;
                  }}
                />
              </CardBody>
            </Card>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup>
              <Button onClick={onClose}>Annuler</Button>

              <Button
                colorScheme="blue"
                isDisabled={!isFormValid}
                onClick={() => onValidate()}
              >
                Valider
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}