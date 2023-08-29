import { JSX, useEffect, useState } from 'react';
import { PlayerCard } from './components/PlayerCard.tsx';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Icon,
  Link,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../store/store.ts';
import {
  selectGameStatus,
  selectLastEventMessage,
  selectNumberOfTurns,
  selectPlayerCardDetails,
} from '../../store/current-game/current-game-selectors.ts';
import {
  cancelLastEventThunk,
  playATurnThunk,
  startGrelottineChallengeThunk,
} from '../../store/current-game/current-game-actions-thunks.ts';
import {
  DiceForm,
  getNewDiceForm,
  isDiceFormValid,
} from '../../components/dice/dice-form.ts';
import { DiceFormComponent } from '../../components/dice/DiceForm.tsx';
import { ScribePanelModals } from './components/ScribePanelModals.tsx';
import {
  HiOutlineBell,
  HiOutlineExternalLink,
  HiOutlineSpeakerphone,
} from 'react-icons/hi';
import { MdCancelPresentation, MdFormatListBulletedAdd } from 'react-icons/md';
import { TbArrowBackUp } from 'react-icons/tb';
import { resolversSlice } from '../../store/resolvers/resolvers.slice.ts';
import { resetGameThunk } from '../../store/current-game/current-game-lifecycle-thunks.ts';
import { GameStatus } from '../../../lib/game/game-handler.ts';

export function ScribePanel(): JSX.Element {
  const players = useAppSelector(selectPlayerCardDetails);
  const numberOfTurns = useAppSelector(selectNumberOfTurns);
  const lastEventMessage = useAppSelector(selectLastEventMessage);
  const gameStatus = useAppSelector(selectGameStatus);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (gameStatus === GameStatus.FINISHED) {
      dispatch(resolversSlice.actions.setEndGame({ active: true }));
    }
  }, [gameStatus]);

  const [diceForm, setDiceForm] = useState(getNewDiceForm() as DiceForm);

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
      <SimpleGrid columns={[2, 4]} mb={[4, 6]} mt={1} mx={4}>
        <Heading fontSize="x-large">Partie en cours</Heading>

        <Link
          pt={2}
          href="https://docs.google.com/document/d/111XDCFHeqVqV-DvnJqJ31rp05tMZbmpxJWQDvPJdIHY/edit#heading=h.kr2581jfe5r"
          isExternal
        >
          Accéder aux règles <Icon mx="2px" as={HiOutlineExternalLink} />
        </Link>

        <Link pt={2} href="/history">
          Afficher l'historique
        </Link>

        <Button
          colorScheme="pink"
          leftIcon={<MdCancelPresentation />}
          onClick={() => dispatch(resetGameThunk())}
        >
          Annuler la partie
        </Button>
      </SimpleGrid>

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

      <SimpleGrid
        columns={[1, 2]}
        spacingX={10}
        spacingY={4}
        p={[2, null, null, 10]}
      >
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
                <Text whiteSpace="initial">Annuler la dernière action</Text>
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
                <Text whiteSpace="initial">Ajouter des Opérations</Text>
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

      <ScribePanelModals />
    </>
  );
}
