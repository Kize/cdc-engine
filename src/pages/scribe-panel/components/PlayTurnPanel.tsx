import { DiceForm } from '../../../components/dice/dice-form.ts';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Stack,
  Text,
} from '@chakra-ui/react';
import { JSX } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store.ts';
import {
  selectCurrentPlayerDetails,
  selectLastEventMessage,
} from '../../../store/current-game/current-game-selectors.ts';
import { GiRabbit } from 'react-icons/gi';
import { playATurnThunk } from '../../../store/current-game/current-game-actions-thunks.ts';
import { isVerdierApplicable } from '../../../../lib/rule-runner/rules/level-3/verdier-rule.ts';
import { GameContextEvent } from '../../../../lib/rule-runner/game-context-event.ts';
import { DieValue } from '../../../../lib/rule-runner/rules/dice-rule.ts';
import { OneLineDiceForm } from '../../../components/dice/OneLineDiceForm.tsx';

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

  const lastEventMessage = useAppSelector(selectLastEventMessage);

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
          onClick={async () => {
            await dispatch(
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
        <OneLineDiceForm
          diceForm={props.diceForm}
          onChangeForm={props.onChangeDiceForm}
        />
      </CardBody>

      <CardFooter>
        <Stack spacing={2}>
          {lastEventMessage.map((message, index) => (
            <Text key={index} borderLeft="1px solid orange" pl={2}>
              {message}
            </Text>
          ))}
        </Stack>
      </CardFooter>
    </Card>
  );
}
