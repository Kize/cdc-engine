import { JSX, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store.ts';
import {
  Button,
  ButtonGroup,
  Center,
  Checkbox,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Tag,
  useBoolean,
} from '@chakra-ui/react';
import {
  selectPlayers,
  selectSloubiScore,
} from '../../../store/current-game/current-game-selectors.ts';
import { Player } from '../../../../lib/player.ts';
import { resolversSlice } from '../../../store/resolvers/resolvers.slice.ts';
import { CreatableSelect, Select } from 'chakra-react-select';
import { useLocalStorage } from '../../../utils/use-local-storage.hook.ts';
import {
  CustomSelectOption,
  customSelectStyles,
} from '../../../utils/custom-select.utils.ts';
import { addPlayerWithChanteSloubiThunk } from '../../../store/current-game/current-game-actions-thunks.ts';
import { BevueModalHeader } from '../../../components/custom-modal/BevueModalHeader.tsx';

export function ChanteSloubiModal(): JSX.Element {
  const { active } = useAppSelector((state) => state.resolvers.chanteSloubi);
  const dispatch = useAppDispatch();

  const [savedPlayers, setSavedPlayers] = useLocalStorage<Array<string>>(
    'players',
    [],
  );
  const inGamePlayers = useAppSelector(selectPlayers);
  const sloubiScore = useAppSelector(selectSloubiScore);

  const sloubiOptions = savedPlayers
    .filter((p) => !inGamePlayers.includes(p))
    .map<CustomSelectOption>((player) => ({ value: player, label: player }));
  const previousOptions = inGamePlayers.map<CustomSelectOption>((player) => ({
    value: player,
    label: player,
  }));

  const [singingPlayer, setSingingPlayer] = useState<null | CustomSelectOption>(
    null,
  );
  const [previousPlayer, setPreviousPlayer] =
    useState<null | CustomSelectOption>(null);
  const [
    isSloubiCompleted,
    { off: setIsNotSloubiCompleted, toggle: toggleIsSloubiCompleted },
  ] = useBoolean(false);

  const resetForm = () => {
    setSingingPlayer(null);
    setPreviousPlayer(null);
    setIsNotSloubiCompleted();
  };

  const onClose = () => {
    dispatch(resolversSlice.actions.setChanteSloubi({ active: false }));

    resetForm();
  };

  const onValidate = () => {
    if (!singingPlayer || !previousPlayer) {
      return;
    }

    dispatch(
      addPlayerWithChanteSloubiThunk({
        sloubiPlayer: singingPlayer?.value,
        previousPlayer: previousPlayer?.value,
        sloubiScore,
        isSloubiCompleted,
      }),
    );
    resetForm();
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={active}
      onClose={onClose}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <BevueModalHeader title={'Chante-Sloubi!'} />

        <ModalBody>
          <Tag
            colorScheme="red"
            ml={3}
            hidden={inGamePlayers.length < 7}
            size="lg"
          >
            8 joueurs max - Sloubi impossible
          </Tag>

          <SimpleGrid columns={[1, 2]} spacingX={5} spacingY={8}>
            <FormControl>
              <FormLabel>Joueur clamant le Sloubi</FormLabel>

              <CreatableSelect
                placeholder="Chanteur"
                value={singingPlayer}
                options={sloubiOptions}
                onChange={setSingingPlayer}
                onCreateOption={(player: Player) => {
                  setSingingPlayer({ value: player, label: player });
                  setSavedPlayers([...savedPlayers, player].sort());
                }}
                {...customSelectStyles}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Valeur du Sloubi</FormLabel>

              <NumberInput size="md" value={sloubiScore} isDisabled>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Joueur précédent</FormLabel>

              <Select
                placeholder={inGamePlayers[0]}
                value={previousPlayer}
                options={previousOptions}
                onChange={setPreviousPlayer}
                {...customSelectStyles}
              />
            </FormControl>

            <Center>
              <Checkbox
                size="lg"
                isChecked={isSloubiCompleted}
                onChange={toggleIsSloubiCompleted}
              >
                Sloubi réussi
              </Checkbox>
            </Center>
          </SimpleGrid>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>Annuler</Button>

            <Button
              colorScheme="blue"
              mr={3}
              isDisabled={
                !singingPlayer || !previousPlayer || inGamePlayers.length > 7
              }
              onClick={onValidate}
            >
              Valider
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
