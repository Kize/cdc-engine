import { JSX, useState } from 'react';
import { PlayerCard } from './PlayerCard.tsx';
import { Button, SimpleGrid } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../store/store.ts';
import { selectPlayerCardDetails } from '../../store/current-game/current-game-selectors.ts';
import {
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
import { FaBell } from 'react-icons/fa';

export function ScribePanel(): JSX.Element {
  const players = useAppSelector(selectPlayerCardDetails);

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
      <Button onClick={() => dispatch(resetGameThunk())}>Reset</Button>
      <Button
        leftIcon={<FaBell />}
        colorScheme="yellow"
        onClick={() => dispatch(startGrelottineChallengeThunk())}
      >
        Grelottine
      </Button>

      <SimpleGrid columns={[1, 2]} spacing={10}>
        <SimpleGrid minChildWidth={['100%', '25%']} spacingX={10} spacingY={2}>
          {players.map((details) => (
            <PlayerCard key={details.player} details={details}></PlayerCard>
          ))}
        </SimpleGrid>

        <DiceFormComponent diceForm={diceForm} onChangeForm={onChangeForm} />
      </SimpleGrid>

      <RulesModals />
    </>
  );
}
