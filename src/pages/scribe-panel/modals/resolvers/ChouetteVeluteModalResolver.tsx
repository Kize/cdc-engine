import { JSX, useState } from 'react';
import { useAppSelector } from '../../../../store/store.ts';
import {
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import { selectPlayers } from '../../../../store/current-game/current-game-selectors.ts';
import { Player } from '../../../../../lib/player.ts';
import { chouetteVeluteResolver } from '../../../../store/resolvers/rules/chouette-velute-rule.resolver.ts';

export function ChouetteVeluteModalResolver(): JSX.Element {
  const { active, player } = useAppSelector(
    (state) => state.resolvers.chouetteVelute,
  );
  const players = useAppSelector(selectPlayers);

  const [selectedPlayers, setSelectedPlayers] = useState([] as Array<Player>);

  const onClose = () => {
    setSelectedPlayers([]);
    chouetteVeluteResolver.reject();
  };

  const onValidate = () => {
    chouetteVeluteResolver.resolve({
      players: selectedPlayers,
    });

    setSelectedPlayers([]);
  };

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={active} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>{player} a réalisé une Chouette Velute !</ModalHeader>

          <ModalBody>
            <FormControl as="fieldset">
              <FormLabel as="legend">
                Joueur ayant disputés la Chouette Velute
              </FormLabel>

              <CheckboxGroup
                value={selectedPlayers}
                onChange={(values: Array<Player>) => setSelectedPlayers(values)}
              >
                <Stack>
                  {players.map((player) => (
                    <Checkbox value={player} key={player} size="lg" mb={2}>
                      {player}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup>
              <Button onClick={onClose}>Annuler</Button>

              <Button
                colorScheme="blue"
                isDisabled={selectedPlayers.length === 0}
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
