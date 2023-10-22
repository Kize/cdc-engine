import { DiceForm } from '../../../components/dice/dice-form.ts';
import { Box, Button, Card, CardBody, CardHeader } from '@chakra-ui/react';
import { DiceFormComponent } from '../../../components/dice/DiceForm.tsx';
import { JSX } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store.ts';
import { selectCurrentPlayerDetails } from '../../../store/current-game/current-game-selectors.ts';
import { GiRabbit } from 'react-icons/gi';
import { playATurnThunk } from '../../../store/current-game/current-game-actions-thunks.ts';
import { isVerdierApplicable } from '../../../../lib/rule-runner/rules/level-3/verdier-rule.ts';
import { GameContextEvent } from '../../../../lib/rule-runner/game-context-event.ts';
import { DieValue } from '../../../../lib/rule-runner/rules/dice-rule.ts';

export function PlayTurnPanel(props: {
  numberOfTurns: number;
  diceForm: DiceForm;
  onChangeDiceForm: (form: DiceForm) => void;
}): JSX.Element {
  const currentPlayer = useAppSelector(selectCurrentPlayerDetails);
  const dispatch = useAppDispatch();

  const isVerdierRuleEnabled = useAppSelector(
    (state) => state.currentGame.rulesConfiguration.isVerdierEnabled,
  );
  const isVerdierActivable = isVerdierApplicable(props.diceForm);

  return (
    <Card pb={[2, 4]} variant="filled" colorScheme="gray">
      <CardHeader fontSize="1.2em">
        <Box as="span" mx={3}>
          Tour: {props.numberOfTurns}
        </Box>

        <Button
          aria-label="Jouer un verdier"
          colorScheme="green"
          variant="outline"
          mx={3}
          borderRadius="full"
          hidden={!isVerdierRuleEnabled}
          isDisabled={!isVerdierActivable}
          onClick={() => {
            dispatch(
              playATurnThunk({
                event: GameContextEvent.VERDIER,
                diceValues: props.diceForm.filter(
                  (value) => value !== null,
                ) as [DieValue, DieValue],
              }),
            );

            props.onChangeDiceForm([null, null, null]);
          }}
        >
          Verdier
        </Button>

        <Button
          aria-label="jouer le civet"
          leftIcon={<GiRabbit />}
          colorScheme="orange"
          mx={3}
          hidden={!currentPlayer || !currentPlayer.hasCivet}
          onClick={() =>
            dispatch(playATurnThunk({ event: GameContextEvent.CIVET_BET }))
          }
        >
          Civet
        </Button>
      </CardHeader>

      <CardBody py={0}>
        <DiceFormComponent
          diceForm={props.diceForm}
          onChangeForm={props.onChangeDiceForm}
        />
      </CardBody>
    </Card>
  );
}
