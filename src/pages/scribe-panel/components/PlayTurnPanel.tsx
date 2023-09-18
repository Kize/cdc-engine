import { DiceForm } from '../../../components/dice/dice-form.ts';
import { Box, Button, Card, CardBody, CardHeader } from '@chakra-ui/react';
import { DiceFormComponent2 } from '../../../components/dice/DiceForm2.tsx';
import { JSX } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store.ts';
import { selectCurrentPlayerDetails } from '../../../store/current-game/current-game-selectors.ts';
import { GiRabbit } from 'react-icons/gi';
import { playCivetTurnThunk } from '../../../store/current-game/current-game-actions-thunks.ts';

export function PlayTurnPanel(props: {
  numberOfTurns: number;
  diceForm: DiceForm;
  onChangeDiceForm: (form: DiceForm) => DiceForm;
}): JSX.Element {
  const currentPlayer = useAppSelector(selectCurrentPlayerDetails);
  const dispatch = useAppDispatch();

  return (
    <Card pb={[2, 4]} variant="filled" colorScheme="gray">
      <CardHeader fontSize={'1.2em'}>
        <Box as="span">Tour: {props.numberOfTurns}</Box>
        <Button
          aria-label="jouer le civet"
          leftIcon={<GiRabbit />}
          colorScheme="orange"
          mx={6}
          hidden={!currentPlayer || !currentPlayer.hasCivet}
          onClick={() => dispatch(playCivetTurnThunk(currentPlayer!.player))}
        >
          Civet
        </Button>
      </CardHeader>

      <CardBody py={0}>
        <DiceFormComponent2
          diceForm={props.diceForm}
          onChangeForm={props.onChangeDiceForm}
        />
      </CardBody>
    </Card>
  );
}
