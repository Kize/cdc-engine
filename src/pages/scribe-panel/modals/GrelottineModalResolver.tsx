import { BaseSyntheticEvent, JSX, useEffect, useState } from 'react';
import { useAppSelector } from '../../../store/store.ts';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  ListItem,
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
  Show,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { selectPlayerCardDetails } from '../../../store/current-game/current-game-selectors.ts';
import { grelottineResolver } from '../../../store/resolvers/rules/grelottine-rule.resolver.ts';
import {
  getMaxGrelottinePossibleAmount,
  GrelottineBet,
} from '../../../../lib/rule-runner/rules/basic-rules/grelottine-rule.ts';
import { Player } from '../../../../lib/player.ts';
import { PlayerCardDetails } from '../PlayerCard.tsx';
import { DiceFormComponent } from '../../../components/dice/DiceForm.tsx';
import {
  DiceForm,
  getNewDiceForm,
  isDiceFormValid,
} from '../../../components/dice/dice-form.ts';
import { BsArrowUpCircle } from 'react-icons/bs';

export function GrelottineModalResolver(): JSX.Element {
  const { active } = useAppSelector((state) => state.resolvers.grelottine);
  const grelottinePlayers = useAppSelector(selectPlayerCardDetails).filter(
    (details) => details.hasGrelottine && details.score > 0,
  );

  const isEnoughPlayers = grelottinePlayers.length >= 2;

  const isSiropEnabled = useAppSelector(
    (state) => state.currentGame.rulesConfiguration.isSiropEnabled,
  );

  const [grelottinPlayer, setGrelottinPlayer] = useState('' as Player);
  const [challengedPlayer, setChallengedPlayer] = useState('' as Player);
  const [grelottinBet, setGrelottinBet] = useState('' as GrelottineBet);
  const [gambledAmount, setGambledAmount] = useState(0);
  const [diceForm, setDiceForm] = useState(getNewDiceForm() as DiceForm);
  const isFormValid =
    grelottinPlayer &&
    challengedPlayer &&
    grelottinBet &&
    gambledAmount &&
    isDiceFormValid(diceForm);

  const grelottineChallengeBets = Object.values(GrelottineBet).filter((bet) => {
    if (bet !== GrelottineBet.SIROP_GRELOT) {
      return true;
    }

    return isSiropEnabled;
  });

  const resetForm = () => {
    setGrelottinPlayer('');
    setChallengedPlayer('');
    setGrelottinBet('' as GrelottineBet);
    setGambledAmount(0);
    setDiceForm(getNewDiceForm());
  };

  const onClose = () => {
    grelottineResolver.reject();

    resetForm();
  };

  const onValidate = () => {
    if (!isFormValid) {
      return;
    }

    grelottineResolver.resolve({
      grelottinPlayer,
      challengedPlayer,
      grelottinBet,
      gambledAmount,
      diceRoll: diceForm,
    });

    resetForm();
  };

  const setAmountToMax = () => {
    if (!grelottinPlayer || !challengedPlayer) {
      setGambledAmount(0);
      return;
    }
    const grelottinScore = grelottinePlayers.find(
      (p) => p.player === grelottinPlayer,
    )!.score;

    const challengedPlayerScore = grelottinePlayers.find(
      (p) => p.player === challengedPlayer,
    )!.score;
    const lowestScore = Math.min(grelottinScore, challengedPlayerScore);

    setGambledAmount(getMaxGrelottinePossibleAmount(lowestScore, grelottinBet));
  };

  useEffect(setAmountToMax, [grelottinPlayer, challengedPlayer, grelottinBet]);

  return (
    <>
      <Modal size="full" isOpen={active} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader bgColor="yellow.300">Défi de Grelottine</ModalHeader>

          <ModalBody hidden={!isEnoughPlayers}>
            <SimpleGrid columns={[1, 1, 4]} spacingY={2}>
              <HStack shouldWrapChildren={true}>
                <GrelottineCustomRadioGroup
                  label="Grelottin"
                  options={grelottinePlayers}
                  selectedOption={grelottinPlayer}
                  opposedOption={challengedPlayer}
                  setOption={setGrelottinPlayer}
                />

                <Stack align="center" mx={4}>
                  <Text as="b">Joueurs</Text>
                  {grelottinePlayers.map((details) => (
                    <Box key={details.player} as="span" height={6}>
                      <Box as={'b'} mr={2}>
                        {details.player}
                      </Box>
                      <Box as="span" fontSize="xs">
                        ({details.score} pts)
                      </Box>
                    </Box>
                  ))}
                </Stack>

                <GrelottineCustomRadioGroup
                  label="Joueur défié"
                  options={grelottinePlayers}
                  selectedOption={challengedPlayer}
                  opposedOption={grelottinPlayer}
                  setOption={setChallengedPlayer}
                />
              </HStack>
              <Spacer />

              <FormControl as="fieldset">
                <FormLabel as="legend">Choix du Défi</FormLabel>

                <RadioGroup
                  value={grelottinBet}
                  onChange={(value) => setGrelottinBet(value as GrelottineBet)}
                >
                  <Stack>
                    {grelottineChallengeBets.map((bet) => (
                      <Radio value={bet} key={bet} size="lg" height={6}>
                        {bet}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </FormControl>

              <Flex flexFlow={['row-reverse', 'row']}>
                <FormControl as="fieldset" w="initial">
                  <FormLabel as="legend">Montant du Défi</FormLabel>

                  <NumberInput
                    size="md"
                    maxW={24}
                    min={0}
                    value={gambledAmount}
                    onChange={(_, value) => setGambledAmount(value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>

                  <Button
                    leftIcon={<BsArrowUpCircle />}
                    size="sm"
                    mt={2}
                    onClick={() => setAmountToMax()}
                  >
                    Au Max
                  </Button>
                </FormControl>
              </Flex>
            </SimpleGrid>

            <Container mt={6}>
              <DiceFormComponent
                diceForm={diceForm}
                onChangeForm={(diceForm) => {
                  setDiceForm(diceForm);
                  return diceForm;
                }}
              />
            </Container>
          </ModalBody>

          <ModalBody hidden={isEnoughPlayers}>
            <Heading fontSize="lg">
              Nécessite au moins deux joueurs remplissant les conditions
              suivantes:
            </Heading>

            <UnorderedList>
              <ListItem>Le joueur doit posséder une Grelottine</ListItem>
              <ListItem>
                Le score du joueur doit être strictement positif
              </ListItem>
            </UnorderedList>
          </ModalBody>

          <ModalFooter hidden={!isEnoughPlayers}>
            <ButtonGroup>
              <Button
                colorScheme="blue"
                isDisabled={!isFormValid}
                onClick={onValidate}
              >
                Valider
              </Button>

              <Button onClick={onClose}>Annuler</Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

interface CustomRadioProps {
  label: string;
  options: Array<PlayerCardDetails>;
  selectedOption: Player;
  opposedOption: Player;
  setOption: (player: Player) => void;
}

function GrelottineCustomRadioGroup({
  label,
  opposedOption,
  options,
  selectedOption,
  setOption,
}: CustomRadioProps): JSX.Element {
  const handleClickWithReset = (event: BaseSyntheticEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const input = event.target.parentElement?.children.at(
      0,
    ) as unknown as HTMLInputElement;

    if (input.checked) {
      event.preventDefault();
      setOption('');
    }
  };

  return (
    <FormControl as="fieldset">
      <FormLabel as="legend">{label}</FormLabel>

      <RadioGroup value={selectedOption} onChange={setOption}>
        <Stack align="center">
          {options.map((details) => (
            <Radio
              value={details.player}
              key={details.player}
              size="lg"
              height={6}
              isDisabled={details.player === opposedOption}
              onClick={handleClickWithReset}
            ></Radio>
          ))}
        </Stack>
      </RadioGroup>
    </FormControl>
  );
}
