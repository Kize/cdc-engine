import { JSX, useState } from 'react';
import { PlayerCard } from './PlayerCard.tsx';
import { Button, Center, Stack } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../store/store.ts';
import { selectPlayersWithScore } from '../../store/current-game/current-game-selectors.ts';
import { resetGameThunk } from '../../store/current-game/current-game-thunks.ts';
import { DiceForm, isDiceFormValid } from '../../components/dice/dice-form.ts';
import { DiceFormComponent } from '../../components/dice/DiceForm.tsx';

function getNewDiceForm(): DiceForm {
  return [null, null, null];
}

export function ScribePanel(): JSX.Element {
  const players = useAppSelector(selectPlayersWithScore);

  const [diceForm, setDiceForm] = useState(getNewDiceForm() as DiceForm);

  const dispatch = useAppDispatch();

  const onChangeForm = (form: DiceForm): DiceForm => {
    const newForm = isDiceFormValid(form) ? getNewDiceForm() : form;

    setDiceForm(newForm);
    return newForm;
  };

  return (
    <>
      <Button onClick={() => dispatch(resetGameThunk())}>Reset</Button>

      <Center>
        <Stack width="80vw">
          {players.map((details) => (
            <PlayerCard key={details.player} details={details}></PlayerCard>
          ))}
        </Stack>
      </Center>

      <DiceFormComponent diceForm={diceForm} onChangeForm={onChangeForm} />
    </>
  );
}
