import { JSX, useEffect, useState } from 'react';
import { RootState, useAppSelector } from '../../../../store/store.ts';
import {
  Button,
  ButtonGroup,
  Container,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
} from '@chakra-ui/react';
import { selectPlayers } from '../../../../store/current-game/current-game-selectors.ts';
import { Player, sortPlayersStartingBy } from '../../../../../lib/player.ts';
import { createSelector } from '@reduxjs/toolkit';
import { bleuRougeRuleResolver } from '../../../../store/resolvers/rules/bleu-rouge-rule.resolver.ts';
import {
  DiceForm,
  isDiceFormValid,
} from '../../../../components/dice/dice-form.ts';
import { TripleDiceForm } from '../../../../components/dice/TripleDiceForm.tsx';
import { Select } from 'chakra-react-select';
import {
  CustomSelectOption,
  customSelectStyles,
} from '../../../../utils/custom-select.utils.ts';
import { BleuRougeBetValue } from '../../../../../lib/rule-runner/rules/level-3/bleu-rouge-rule.ts';

const selectBleuRougePlayers = createSelector(
  selectPlayers,
  (state: RootState) => state.resolvers.bleuRouge.player,
  sortPlayersStartingBy,
);

interface BleuRougeBidForm {
  player: Player;
  bet: null | CustomSelectOption;
}

const getNewBidForm = (player: Player): BleuRougeBidForm => ({
  player,
  bet: null,
});

export function BleuRougeModalResolver(): JSX.Element {
  const { active, player } = useAppSelector(
    (state) => state.resolvers.bleuRouge,
  );
  const bleuRougePlayers = useAppSelector(selectBleuRougePlayers);

  const [bids, setBids] = useState<Array<BleuRougeBidForm>>([]);
  const [diceForm, setDiceForm] = useState<DiceForm>([null, null, null]);

  useEffect(() => {
    setBids(bleuRougePlayers.map(getNewBidForm));
  }, [bleuRougePlayers]);

  const isFormValid =
    isDiceFormValid(diceForm) &&
    bids.every((bid) => bid.bet !== null && bid.bet.value);

  const getOptions = (player: Player): Array<CustomSelectOption> => {
    return Array.from({ length: 16 }).map((_, index) => {
      const value = (index + 3).toString();

      return {
        value,
        label: value,
        isDisabled: bids.some(
          (bid) => bid.bet?.value === value && player !== bid.player,
        ),
      };
    });
  };

  const onClose = () => {
    bleuRougeRuleResolver.reject();
    resetForm();
  };

  const onValidate = () => {
    if (isFormValid) {
      bleuRougeRuleResolver.resolve({
        bids: bids.map(({ bet, player }) => ({
          player,
          bet: parseInt(bet!.value) as BleuRougeBetValue,
        })),
        diceRoll: diceForm,
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setBids([]);
    setDiceForm([null, null, null]);
  };

  const setBid = (option: null | CustomSelectOption, player: Player) => {
    const newBids = bids.map((bid) => {
      if (bid.player === player) {
        return {
          ...bid,
          bet: option,
        };
      }

      return { ...bid };
    });

    setBids(newBids);
  };

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isOpen={active}
        onClose={onClose}
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>{player} a réalisé un Bleu-Rouge!</ModalHeader>

          <ModalBody>
            <SimpleGrid columns={[2, bids.length]} spacingX={4}>
              {bids.map((bid) => (
                <FormControl key={bid.player}>
                  <FormLabel>{bid.player}</FormLabel>

                  <Select
                    value={bid.bet}
                    options={getOptions(bid.player)}
                    onChange={(value) => setBid(value, bid.player)}
                    {...customSelectStyles}
                  ></Select>
                </FormControl>
              ))}
            </SimpleGrid>

            <Container mt={4} maxW={['100%', '60%']}>
              <FormControl>
                <FormLabel fontSize={'sm'}>Relance du Blue-Rouge:</FormLabel>

                <TripleDiceForm
                  diceForm={diceForm}
                  onChangeForm={(diceForm) => setDiceForm(diceForm)}
                ></TripleDiceForm>
              </FormControl>
            </Container>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup>
              <Button onClick={onClose}>Annuler</Button>

              <Button
                colorScheme="blue"
                isDisabled={!isFormValid}
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
