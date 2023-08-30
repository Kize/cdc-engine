import { JSX, useState } from 'react';
import { useAppSelector } from '../../../../store/store.ts';
import {
  Button,
  ButtonGroup,
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
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react';
import { suiteRuleResolver } from '../../../../store/resolvers/rules/suite-rule.resolver.ts';
import { selectPlayers } from '../../../../store/current-game/current-game-selectors.ts';
import { Player } from '../../../../../lib/player.ts';

export function SuiteModalResolver(): JSX.Element {
  const { active, player } = useAppSelector((state) => state.resolvers.suite);
  const players = useAppSelector(selectPlayers);

  const [selectedPlayer, setSelectedPlayer] = useState('' as Player);
  const [multiplier, setMultiplier] = useState(1);

  const onClose = () => {
    suiteRuleResolver.reject();
    resetForm();
  };

  const onValidate = () => {
    suiteRuleResolver.resolve({ losingPlayer: selectedPlayer, multiplier });
    resetForm();
  };

  const resetForm = () => {
    setSelectedPlayer('');
    setMultiplier(1);
  };

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isOpen={active}
        onClose={onClose}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>{player} a réalisé une Suite</ModalHeader>

          <ModalBody>
            <SimpleGrid columns={[1, 2]}>
              <FormControl as="fieldset">
                <FormLabel as="legend">Joueur ayant perdu la Suite</FormLabel>

                <RadioGroup onChange={setSelectedPlayer} value={selectedPlayer}>
                  <Stack>
                    {players.map((player) => (
                      <Radio value={player} key={player} size="lg" mb={2}>
                        {player}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </FormControl>

              <Center>
                <FormControl w={['100%', null, '50%']}>
                  <FormLabel>Multiplicateur</FormLabel>

                  <NumberInput
                    size="md"
                    maxW={24}
                    min={1}
                    value={multiplier}
                    onChange={(_, value) => setMultiplier(value)}
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
          </ModalBody>

          <ModalFooter>
            <ButtonGroup>
              <Button onClick={onClose}>Annuler</Button>

              <Button
                colorScheme="blue"
                isDisabled={!selectedPlayer}
                onClick={onValidate}
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
