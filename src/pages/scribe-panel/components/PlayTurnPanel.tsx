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
import { selectLastEventMessage } from '../../../store/current-game/current-game-selectors.ts';
import {
  cancelLastEventThunk,
  playATurnThunk,
} from '../../../store/current-game/current-game-actions-thunks.ts';
import { isVerdierApplicable } from '../../../../lib/rule-runner/rules/level-3/verdier-rule.ts';
import { GameContextEvent } from '../../../../lib/rule-runner/game-context-event.ts';
import { DieValue } from '../../../../lib/rule-runner/rules/dice-rule.ts';
import { OneLineDiceForm } from '../../../components/dice/OneLineDiceForm.tsx';
import { TbArrowBackUp } from 'react-icons/tb';

export function PlayTurnPanel(props: {
  numberOfTurns: number;
  diceForm: DiceForm;
  onChangeDiceForm: (form: DiceForm) => void;
}): JSX.Element {
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
          borderRadius="full"
          mx={3}
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
          verdier
        </Button>

        <Button
          leftIcon={<TbArrowBackUp />}
          colorScheme="orange"
          variant="outline"
          borderRadius="full"
          float="right"
          onClick={() => dispatch(cancelLastEventThunk())}
        >
          <Text whiteSpace="initial">annuler</Text>
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
