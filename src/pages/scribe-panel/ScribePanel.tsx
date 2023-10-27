import { JSX, useEffect, useState } from 'react';
import { PlayerCard } from './components/PlayerCard.tsx';
import { Show, SimpleGrid } from '@chakra-ui/react';
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
import { GameStatus } from '../../../lib/game/game-handler.ts';
import { ScribePanelHeader } from './components/ScribePanelHeader.tsx';
import { MainActionsPanel } from './components/MainActionsPanel.tsx';
import { PlayTurnPanel } from './components/PlayTurnPanel.tsx';
import { GameContextEvent } from '../../../lib/rule-runner/game-context-event.ts';

export function ScribePanel(): JSX.Element {
  const players = useAppSelector(selectPlayerCardDetails);
  const numberOfTurns = useAppSelector(selectNumberOfTurns);
  const gameStatus = useAppSelector(selectGameStatus);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (gameStatus === GameStatus.FINISHED) {
      dispatch(resolversSlice.actions.setEndGame({ active: true }));
    }
  });

  const [diceForm, setDiceForm] = useState(getNewDiceForm() as DiceForm);

  const onChangeForm = (form: DiceForm): void => {
    setDiceForm(form);
    if (isDiceFormValid(form)) {
      setTimeout(async () => {
        await dispatch(
          playATurnThunk({ event: GameContextEvent.DICE_ROLL, diceRoll: form }),
        );
        setDiceForm(getNewDiceForm());
      }, 200);
    }
  };

  return (
    <>
      <ScribePanelHeader />

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
        <Show above="md">
          <MainActionsPanel />
        </Show>

        <PlayTurnPanel
          numberOfTurns={numberOfTurns}
          diceForm={diceForm}
          onChangeDiceForm={onChangeForm}
        />

        <Show below="md">
          <MainActionsPanel />
        </Show>
      </SimpleGrid>

      <ScribePanelModals />
    </>
  );
}
