import { JSX, useState } from 'react';
import { PlayerCard } from './PlayerCard.tsx';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  Icon,
  Link,
  SimpleGrid,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../store/store.ts';
import {
  selectLastEventMessage,
  selectNumberOfTurns,
  selectPlayerCardDetails,
} from '../../store/current-game/current-game-selectors.ts';
import {
  cancelLastEventThunk,
  playATurnThunk,
  resetGameThunk,
  startGrelottineChallengeThunk,
} from '../../store/current-game/current-game-thunks.ts';
import {
  DiceForm,
  getNewDiceForm,
  isDiceFormValid,
} from '../../components/dice/dice-form.ts';
import { DiceFormComponent } from '../../components/dice/DiceForm.tsx';
import { RulesModals } from './RulesModals.tsx';
import {
  HiOutlineBell,
  HiOutlineExternalLink,
  HiOutlineSpeakerphone,
} from 'react-icons/hi';
import { MdCancelPresentation, MdFormatListBulletedAdd } from 'react-icons/md';
import { TbArrowBackUp } from 'react-icons/tb';
import { resolversSlice } from '../../store/resolvers/resolvers.slice.ts';

export function ScribePanel(): JSX.Element {
  const players = useAppSelector(selectPlayerCardDetails);
  const numberOfTurns = useAppSelector(selectNumberOfTurns);
  const lastEventMessage = useAppSelector(selectLastEventMessage);

  const [diceForm, setDiceForm] = useState(getNewDiceForm() as DiceForm);

  const dispatch = useAppDispatch();

  const onChangeForm = (form: DiceForm): DiceForm => {
    let newForm: DiceForm;

    if (isDiceFormValid(form)) {
      dispatch(playATurnThunk(form));

      newForm = getNewDiceForm();
    } else {
      newForm = form;
    }

    setDiceForm(newForm);
    return newForm;
  };

  return (
    <>
      <Flex mb={[2, 6]} mt={1} mx={2}>
        <Spacer />

        <Center>
          <Link
            href="https://docs.google.com/document/d/111XDCFHeqVqV-DvnJqJ31rp05tMZbmpxJWQDvPJdIHY/edit#heading=h.kr2581jfe5r"
            isExternal
            variant="filled"
          >
            Accéder aux règles <Icon mx="2px" as={HiOutlineExternalLink} />
          </Link>
        </Center>

        <Spacer />

        <Button
          colorScheme="pink"
          leftIcon={<MdCancelPresentation />}
          onClick={() => dispatch(resetGameThunk())}
        >
          Annuler la partie
        </Button>
      </Flex>

      <SimpleGrid
        minChildWidth={['100%', '20%']}
        spacingX={[4, 10]}
        spacingY={[1, 2]}
        mx={[1, 2]}
      >
        {players.map((details) => (
          <PlayerCard key={details.player} details={details}></PlayerCard>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={[1, 2]} spacing={10} p={[2, null, null, 10]}>
        <Card pb={[2, 4]} variant="filled" colorScheme="gray">
          <CardHeader fontSize={'xs'}>
            <SimpleGrid minChildWidth={['100%', '45%']} spacingX={2}>
              {lastEventMessage.map((message, index) => (
                <Text key={index}>{message}</Text>
              ))}
            </SimpleGrid>
          </CardHeader>

          <CardBody py={0}>
            <SimpleGrid columns={[1, 2]} spacing={2} m={[0, 6]}>
              <Button
                leftIcon={<TbArrowBackUp />}
                h={[16, 32]}
                variant="outline"
                colorScheme="blackAlpha"
                onClick={() => dispatch(cancelLastEventThunk())}
              >
                Annuler la dernière action
              </Button>

              <Button
                leftIcon={<HiOutlineBell />}
                colorScheme="yellow"
                h={[16, 32]}
                onClick={() => dispatch(startGrelottineChallengeThunk())}
              >
                Grelottine
              </Button>

              <Button
                leftIcon={<HiOutlineSpeakerphone />}
                colorScheme="blue"
                h={[16, 32]}
                onClick={() =>
                  dispatch(
                    resolversSlice.actions.setChanteSloubi({ active: true }),
                  )
                }
              >
                Chante-Sloubi
              </Button>

              <Button
                leftIcon={<MdFormatListBulletedAdd />}
                colorScheme="green"
                h={[16, 32]}
                onClick={() =>
                  dispatch(
                    resolversSlice.actions.setAddOperations({ active: true }),
                  )
                }
              >
                Ajouter des Opérations
              </Button>
            </SimpleGrid>
          </CardBody>
        </Card>

        <Card pb={[2, 4]} variant="filled" colorScheme="gray">
          <CardHeader fontSize={'1.2em'}>Tour: {numberOfTurns}</CardHeader>

          <CardBody py={0}>
            <DiceFormComponent
              diceForm={diceForm}
              onChangeForm={onChangeForm}
            />
          </CardBody>
        </Card>
      </SimpleGrid>

      <RulesModals />
    </>
  );
}
