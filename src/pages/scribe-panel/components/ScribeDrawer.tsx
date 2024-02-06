import { JSX } from 'react';
import {
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Icon,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  HiOutlineBell,
  HiOutlineExternalLink,
  HiOutlineSpeakerphone,
} from 'react-icons/hi';
import { IconType } from 'react-icons/lib/cjs/iconBase';
import { CancelGameButton } from './CancelGameButton.tsx';
import { TbArrowBackUp } from 'react-icons/tb';
import {
  cancelLastEventThunk,
  startGrelottineChallengeThunk,
} from '../../../store/current-game/current-game-actions-thunks.ts';
import { resolversSlice } from '../../../store/resolvers/resolvers.slice.ts';
import { MdFormatListBulletedAdd } from 'react-icons/md';
import { useAppDispatch } from '../../../store/store.ts';

interface Props {
  isOpen: boolean;
  isDoublette: boolean;
  onClose: () => void;
}

export function ScribeDrawer({
  isOpen,
  onClose,
  isDoublette,
}: Props): JSX.Element {
  const dispatch = useAppDispatch();

  const buttonsProps = {
    h: 16,
  };

  const cancelLastEvent = () => {
    dispatch(cancelLastEventThunk());
    onClose();
  };

  const startGrelottine = async () => {
    await dispatch(startGrelottineChallengeThunk());
    onClose();
  };

  const openChanteSloubiModal = () => {
    dispatch(resolversSlice.actions.setChanteSloubi({ active: true }));
    onClose();
  };

  const openAddOperationModal = () => {
    dispatch(resolversSlice.actions.setAddOperations({ active: true }));
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Options:</DrawerHeader>

        <DrawerBody>
          <Stack direction="column" spacing={4}>
            <RouterLink to="/history">
              <Button
                colorScheme="blackAlpha"
                variant="outline"
                {...buttonsProps}
                w="100%"
              >
                Afficher l'historique
              </Button>
            </RouterLink>

            <Button
              leftIcon={<HiOutlineBell />}
              colorScheme="yellow"
              onClick={startGrelottine}
              {...buttonsProps}
            >
              Grelottine
            </Button>

            <Button
              leftIcon={<HiOutlineSpeakerphone />}
              colorScheme="blue"
              onClick={openChanteSloubiModal}
              isDisabled={isDoublette}
              {...buttonsProps}
            >
              Chante-Sloubi
            </Button>

            <Button
              leftIcon={<TbArrowBackUp />}
              colorScheme="orange"
              onClick={cancelLastEvent}
              {...buttonsProps}
            >
              <Text whiteSpace="initial">Annuler la dernière action</Text>
            </Button>

            <Button
              leftIcon={<MdFormatListBulletedAdd />}
              colorScheme="green"
              onClick={openAddOperationModal}
              {...buttonsProps}
            >
              <Text whiteSpace="initial">Ajouter des Opérations</Text>
            </Button>
          </Stack>
        </DrawerBody>

        <DrawerFooter>
          <Stack direction="column" spacing={4} mx="auto">
            <CancelGameButton />

            <Center>
              <Link
                href="https://docs.google.com/document/d/111XDCFHeqVqV-DvnJqJ31rp05tMZbmpxJWQDvPJdIHY/edit#heading=h.kr2581jfe5r"
                isExternal
              >
                <Button
                  colorScheme="blackAlpha"
                  variant="outline"
                  w="100%"
                  rightIcon={
                    <Icon mx="2px" as={HiOutlineExternalLink as IconType} />
                  }
                >
                  Accéder aux règles
                </Button>
              </Link>
            </Center>
          </Stack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
