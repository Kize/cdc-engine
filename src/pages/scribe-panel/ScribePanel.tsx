import { JSX, useEffect, useState } from 'react';
import { PlayerCard } from './components/PlayerCard.tsx';
import {
  Show,
  SimpleGrid,
  Flex,
  Spacer,
  Hide,
  Text
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../store/store.ts';
import {
  selectGameStatus,
  selectNumberOfTurns,
  selectPlayerCardDetails,
} from '../../store/current-game/current-game-selectors.ts';
import { playATurnThunk } from '../../store/current-game/current-game-actions-thunks.ts';
import {
  DiceForm,
  getNewDiceForm,
  isDiceFormValid,
} from '../../components/dice/dice-form.ts';
import { ScribePanelModals } from './components/ScribePanelModals.tsx';
import { resolversSlice } from '../../store/resolvers/resolvers.slice.ts';
import { resetGameThunk } from '../../store/current-game/current-game-lifecycle-thunks.ts';
import { GameStatus } from '../../../lib/game/game-handler.ts';
import { ScribePanelHeader } from './components/ScribePanelHeader.tsx';
import { MainActionsPanel } from './components/MainActionsPanel.tsx';
import { PlayTurnPanel } from './components/PlayTurnPanel.tsx';

export function ScribePanel(): JSX.Element {
  const players = useAppSelector(selectPlayerCardDetails);
  const numberOfTurns = useAppSelector(selectNumberOfTurns);
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
    <Flex direction="column"
      width="100%"
      height="100vh"
    >
      <ScribePanelHeader cancelGame={() => dispatch(resetGameThunk())} />

      <SimpleGrid
        //minChildWidth={['40%', '20%']}
        columns={{ "base": 2, "md": 4 }}
        spacingX={{ "base": 1, "md": 2 }}
        spacingY={{ "base": 1, "md": 2 }}
        marginX={{ "base": 2, "md": 4 }}
      >
        {players.map((details) => (
          <PlayerCard
            key={details.player}
            details={details}
          ></PlayerCard>
        ))}
      </SimpleGrid>

      <Spacer />

      <SimpleGrid
        columns={{ "base": 1, "md": 2 }}
        mx={{ "base": 2, "md": 4 }}
        mt={2}
        spacing={2}
      //p={[2, null, null, 10]}
      >
        <Show above="md">
          <MainActionsPanel />
        </Show>

        <PlayTurnPanel
          numberOfTurns={numberOfTurns}
          diceForm={diceForm}
          onChangeDiceForm={onChangeForm}
        />

        <Hide above="md">
          <MainActionsPanel />
        </Hide>
      </SimpleGrid>

      <ScribePanelModals />
    </Flex>
  );
}
