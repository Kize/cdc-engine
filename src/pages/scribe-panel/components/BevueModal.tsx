import {
  Flex,
  Heading,
  Spacer,
  HStack,
  Box,
  Button,
  Show,
  Link,
  SimpleGrid,
  VStack
} from '@chakra-ui/react';
import {
  IconButton,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { RiFilePaper2Line } from 'react-icons/ri';
import { HiOutlineExternalLink, HiOutlineSpeakerphone } from 'react-icons/hi';
import { MdCancelPresentation, MdOutlineHistory } from 'react-icons/md';
import { RxHamburgerMenu } from 'react-icons/rx';
import { GiWhistle } from 'react-icons/gi';
import { Link as RouterLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/store.ts';
import { resolversSlice } from '../../../store/resolvers/resolvers.slice.ts';
import {
  selectPlayerCardDetails,
} from '../../../store/current-game/current-game-selectors.ts';

interface Props {
  cancelGame: () => void;
}

export function ScribePanelHeader({ cancelGame }: Props) {
  //const { isOpenBevueModal, onOpenBevueModal, onCloseBevueModal } = useDisclosure()
  return (
    <>
      <Flex /*columns={[2, 4]} spacing={2} mb={[4, 6]} mt={1} mx={4}*/
        mx={[2, 4]}
        my={2}
        alignItems="center"
      >
        <Heading fontSize="3xl" className='Cvl_de_Chovette_Header'>Cvl de Chovette</Heading>

        <Spacer />

        <HStack spacing={[1, 2]}>

          <Link
            href="https://docs.google.com/document/d/111XDCFHeqVqV-DvnJqJ31rp05tMZbmpxJWQDvPJdIHY/edit#heading=h.kr2581jfe5r"
            isExternal
          >
            <Button
              pr={[2, 4]}
              colorScheme="gray"
              leftIcon={<RiFilePaper2Line />}
            >
              <Show above="md">
                Accéder aux règles&nbsp;<HiOutlineExternalLink />
              </Show>
            </Button>
          </Link>

          <Box>
            <RouterLink to="/history">
              <Button
                pr={[2, 4]}
                colorScheme="gray"
                leftIcon={<MdOutlineHistory />}
              >
                <Show above="md">
                  Afficher l'historique
                </Show>
              </Button>
            </RouterLink>
          </Box>

          <Button
            pr={[2, 4]}
            leftIcon={<GiWhistle />}
            colorScheme='pink'
            onClick={isOpenBevueModal}
          >
            <Show above="md">
              "Bévue…"
            </Show>
          </Button>


          <BurgerMenu />
        </HStack>

      </Flex>

      <BevueModal />
    </>
  );

  function BurgerMenu() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    //const { isOpenBevueModal, onOpenBevueModal, onCloseBevueModal } = useDisclosure()
    //const btnRef = React.useRef()
    const dispatch = useAppDispatch();

    return (
      <>
        <IconButton
          aria-label='burger menu'
          icon={<RxHamburgerMenu />}
          //ref={btnRef}
          colorScheme="gray"
          onClick={onOpen}
        />
        <Drawer
          isOpen={isOpen}
          placement='right'
          onClose={onClose}
        //finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>

            <DrawerBody>
              <VStack
                align='stretch'
              >

                <Button
                  pr={[2, 4]}
                  leftIcon={<GiWhistle />}
                  colorScheme='pink'
                  onClick={onOpenBevueModal}
                >
                  Bévue…
                </Button>

                <Button
                  leftIcon={<HiOutlineSpeakerphone />}
                  colorScheme="blue"
                  onClick={() =>
                    dispatch(resolversSlice.actions.setChanteSloubi({ active: true }))
                  }
                >
                  Chante-Sloubi
                </Button>
              </VStack>
            </DrawerBody>

            <DrawerFooter>
              <Button
                pr={[2, 4]}
                colorScheme="pink"
                leftIcon={<MdCancelPresentation />}
                onClick={cancelGame}
              >
                Annuler la partie
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  const { isOpenBevueModal, onOpenBevueModal, onCloseBevueModal } = useDisclosure()

  function BevueModal() {
    const players = useAppSelector(selectPlayerCardDetails);
    //const { isOpen, onOpen, onClose } = useDisclosure()
    //onOpen_: () => onOpen

    return (
      <Modal
        //onClose={onClose}
        //isOpen={isOpen}
        onClose={onCloseBevueModal}
        isOpen={isOpenBevueModal}
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bévue pour :</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid
              minChildWidth={['40%', '20%']}
              spacingX={[1, 2]}
              spacingY={[1, 2]}
            //marginX={[2, 4]}
            >
              {players.map((details, index) => (
                <Button key={index}>
                  {details.player}
                </Button>
              ))}
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button /*onClick={onClose}*/ onClick={onCloseBevueModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }

}
