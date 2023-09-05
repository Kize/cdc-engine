import { JSX, useEffect, useState } from 'react';
import { RootState, useAppSelector } from '../../../../store/store.ts';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
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
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react';
import { siropRuleResolver } from '../../../../store/resolvers/rules/sirop-rule.resolver.ts';
import { selectPlayers } from '../../../../store/current-game/current-game-selectors.ts';
import { DieInput } from '../../../../components/dice/DieInput.tsx';
import { Player, sortPlayersStartingBy } from '../../../../../lib/player.ts';
import { OptionalDieValue } from '../../../../components/dice/dice-form.ts';
import {
  BidType,
  dieValueToBidType,
  PlayableBid,
  SiropBid,
} from '../../../../../lib/rule-runner/rules/level-1/sirotage-rule.types.ts';
import { createSelector } from '@reduxjs/toolkit';
import {
  CustomSelectOption,
  customSelectStyles,
} from '../../../../utils/custom-select.utils.ts';
import { Select } from 'chakra-react-select';
import { attrapeOiseauRuleResolver } from '../../../../store/resolvers/rules/attrape-oiseau-rule.resolver.ts';

const selectSiropPlayers = createSelector(
  selectPlayers,
  (state: RootState) => state.resolvers.sirop.player,
  sortPlayersStartingBy,
);

const getNewBidForm = (player: Player) => ({
  player,
  playerBid: '' as BidType,
  isBidValidated: false,
});

export function SiropModalResolver(): JSX.Element {
  const { active, player, chouetteValue, playableBids } = useAppSelector(
    (state) => state.resolvers.sirop,
  );

  const isAttrapeOiseauEnabled = useAppSelector(
    (state) => state.currentGame.rulesConfiguration.isAttrapeOiseauEnabled,
  );

  const siropPlayers = useAppSelector(selectSiropPlayers);
  useEffect(() => {
    setBids(siropPlayers.map(getNewBidForm));
  }, [siropPlayers]);

  const attrapeOiseauOptions = useAppSelector(selectPlayers)
    .filter((p) => p !== player)
    .map<CustomSelectOption>((player) => ({
      label: player,
      value: player,
    }));

  const [selectedAttrapeOiseau, setSelectedAttrapeOiseau] =
    useState<CustomSelectOption | null>(null);
  const [bids, setBids] = useState<Array<SiropBid>>([]);
  const [dieValue, setDieValue] = useState<OptionalDieValue>(null);
  const [validatedPlayers, setValidatedPlayers] = useState<Array<Player>>([]);

  const isFormValid =
    dieValue !== null && bids.every((bid) => (bid.playerBid as string) !== '');

  const enabledBids = playableBids.map<PlayableBid>((bid) => {
    let disabled;
    switch (bid.type) {
      case BidType.COUCHE_SIROP:
        disabled = !!selectedAttrapeOiseau;
        break;
      case BidType.FILE_SIROP:
        disabled = !selectedAttrapeOiseau;
        break;
      default:
        disabled = !bid.isPlayable;
    }

    return {
      type: bid.type,
      isPlayable: !disabled,
    };
  });

  const selectDie = (value: OptionalDieValue): OptionalDieValue => {
    setDieValue(value);
    return value;
  };

  const resetForm = () => {
    setSelectedAttrapeOiseau(null);
    setDieValue(null);
    setValidatedPlayers([]);
    setBids([]);
  };

  const onClose = () => {
    if (isAttrapeOiseauEnabled) {
      attrapeOiseauRuleResolver.reject();
    } else {
      siropRuleResolver.reject();
    }

    resetForm();
  };

  const onValidate = (isSirote: boolean) => {
    if (!isSirote) {
      siropRuleResolver.resolve({ isSirote: false });
    } else if (isFormValid) {
      if (selectedAttrapeOiseau === null) {
        siropRuleResolver.resolve({
          isSirote: true,
          lastDieValue: dieValue,
          bids: bids.map(({ player, playerBid }) => ({
            player,
            playerBid,
            isBidValidated: validatedPlayers.includes(player),
          })),
        });
      } else {
        attrapeOiseauRuleResolver.resolve({
          isSirote: true,
          playerWhoMakeAttrapeOiseau: selectedAttrapeOiseau.value,
          lastDieValue: dieValue,
          bids: bids.map(({ player, playerBid }) => ({
            player,
            playerBid,
            isBidValidated: validatedPlayers.includes(player),
          })),
        });
      }
    }

    resetForm();
  };

  const selectedABet = (playerBid: BidType, player: Player): void => {
    const newBids = bids.map((bidForm) => {
      if (bidForm.player === player) {
        return { ...bidForm, playerBid };
      }

      return { ...bidForm };
    });

    setBids(newBids);
  };

  const isSiropGagnantInputDisabled = (bidForm: SiropBid): boolean => {
    if (!dieValue) {
      return true;
    }

    const hasBetValidBeauSirop =
      bidForm.playerBid === BidType.BEAU_SIROP && dieValue === chouetteValue;
    const hasBetRightValue =
      bidForm.playerBid === dieValueToBidType.get(dieValue);

    return !(hasBetValidBeauSirop || hasBetRightValue);
  };

  const cardsProps = {
    size: 'sm',
    mb: 2,
  };

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isOpen={active}
        size="full"
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            {player} a réalisé une Chouette de {chouetteValue}!
          </ModalHeader>

          <ModalBody>
            {isAttrapeOiseauEnabled && (
              <Card {...cardsProps}>
                <CardHeader pb={0} color="blue">
                  Attrape-Oiseau
                </CardHeader>

                <CardBody pt={0}>
                  <Container>
                    <Select
                      isClearable
                      placeholder={attrapeOiseauOptions[0]?.label ?? ''}
                      value={selectedAttrapeOiseau}
                      options={attrapeOiseauOptions}
                      onChange={setSelectedAttrapeOiseau}
                      {...customSelectStyles}
                    />
                  </Container>
                </CardBody>
              </Card>
            )}

            <Card {...cardsProps}>
              <CardHeader pb={0} color="blue">
                Annonces:
              </CardHeader>

              <CardBody pt={0}>
                <SimpleGrid columns={[2, bids.length]} spacingY={4}>
                  {bids.map((bidForm) => (
                    <FormControl as="fieldset" key={bidForm.player}>
                      <FormLabel as="legend">{bidForm.player}</FormLabel>

                      <RadioGroup
                        onChange={(bet: BidType) =>
                          selectedABet(bet, bidForm.player)
                        }
                        value={bidForm.playerBid}
                      >
                        <Stack>
                          {enabledBids.map((bid) => (
                            <Radio
                              value={bid.type}
                              key={bid.type}
                              disabled={!bid.isPlayable}
                              size="md"
                            >
                              {bid.type}
                            </Radio>
                          ))}
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                  ))}
                </SimpleGrid>
              </CardBody>
            </Card>

            <Card {...cardsProps}>
              <CardHeader pb={0} color="blue">
                Résultat du dé siroté:
              </CardHeader>

              <CardBody>
                <Container maxW="25em">
                  <DieInput dieValue={dieValue} selectDie={selectDie} />
                </Container>
              </CardBody>
            </Card>

            <Card {...cardsProps}>
              <CardHeader pb={0} color="blue">
                Validation des annonces:
              </CardHeader>

              <CardBody mb={2}>
                <SimpleGrid columns={[1, bids.length]}>
                  <CheckboxGroup
                    value={validatedPlayers}
                    onChange={(values: Array<Player>) =>
                      setValidatedPlayers(values)
                    }
                  >
                    {bids.map((bidForm) => (
                      <Checkbox
                        value={bidForm.player}
                        key={bidForm.player}
                        isDisabled={isSiropGagnantInputDisabled(bidForm)}
                        size="sm"
                      >
                        {bidForm.player} a crié "Sirop-Gagnant!"
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </SimpleGrid>
              </CardBody>
            </Card>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup>
              <Button onClick={onClose}>Annuler</Button>

              <Button colorScheme="orange" onClick={() => onValidate(false)}>
                Aucun sirotage
              </Button>

              <Button
                colorScheme="blue"
                isDisabled={!isFormValid}
                onClick={() => onValidate(true)}
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
