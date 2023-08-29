import {
  Button,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { TbArrowBackUp } from 'react-icons/tb';
import { HiOutlineBell, HiOutlineSpeakerphone } from 'react-icons/hi';
import { MdFormatListBulletedAdd } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../../store/store.ts';
import { selectLastEventMessage } from '../../../store/current-game/current-game-selectors.ts';
import {
  cancelLastEventThunk,
  startGrelottineChallengeThunk,
} from '../../../store/current-game/current-game-actions-thunks.ts';
import { resolversSlice } from '../../../store/resolvers/resolvers.slice.ts';

export function MainActionsPanel() {
  const lastEventMessage = useAppSelector(selectLastEventMessage);
  const dispatch = useAppDispatch();

  return (
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
              dispatch(resolversSlice.actions.setChanteSloubi({ active: true }))
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
  );
}
