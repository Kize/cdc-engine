import { JSX, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { MdCancelPresentation } from 'react-icons/md';
import { resetGameThunk } from '../../../store/current-game/current-game-lifecycle-thunks.ts';
import { useAppDispatch } from '../../../store/store.ts';

export function CancelGameButton(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const dispatch = useAppDispatch();

  return (
    <>
      <Button
        colorScheme="pink"
        leftIcon={<MdCancelPresentation />}
        onClick={onOpen}
      >
        Annuler la partie
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Annuler la partie ?
            </AlertDialogHeader>

            <AlertDialogBody>
              Êtes-vous sûr de vouloir annuler la partie ? Les données seront
              effacées.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Revenir en jeu
              </Button>

              <Button
                colorScheme="red"
                onClick={() => {
                  dispatch(resetGameThunk());
                }}
                ml={3}
              >
                Quitter la partie
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
