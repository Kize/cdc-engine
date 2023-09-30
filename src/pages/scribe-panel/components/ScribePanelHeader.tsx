import {
  Flex,
  Heading,
  Spacer,
  HStack,
  Button,
  Show,
  LinkBox,
  LinkOverlay,
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
import { useBreakpointValue } from '@chakra-ui/react'

interface Props {
  cancelGame: () => void;
}

export function ScribePanelHeader({ cancelGame }: Props) {

  const { isOpen: isOpenBevueModal, onOpen: onOpenBevueModal, onClose: onCloseBevueModal } = useDisclosure()

  const bpDetect = useBreakpointValue(
    {
      base: 'base',
      md: 'md',
    },
    { // Defaults
      fallback: 'base',
    },
  )

  function HeaderButtonsList(
    { breakpoint = "base"/*undefined*/ }
  ) {
    return (
      <>
        <HeaderResponsiveButton
          as={LinkBox}
          leftIcon={<RiFilePaper2Line />}
          rightIcon={breakpoint === bpDetect ? <HiOutlineExternalLink /> : undefined}
        >
          <Show above={breakpoint}>
            <LinkOverlay
              href="https://docs.google.com/document/d/111XDCFHeqVqV-DvnJqJ31rp05tMZbmpxJWQDvPJdIHY/edit#heading=h.kr2581jfe5r"
              isExternal
            >
              Accéder aux règles
            </LinkOverlay>
            <Spacer />
          </Show>
        </HeaderResponsiveButton>

        <HeaderResponsiveButton
          as={RouterLink}
          to="/history"
          colorScheme="gray"
          justifyContent="flex-start"
          leftIcon={<MdOutlineHistory />}
        >
          <Show above={breakpoint}>
            Afficher l'historique
          </Show>
        </HeaderResponsiveButton>

        <HeaderResponsiveButton
          colorScheme='pink'
          leftIcon={<GiWhistle />}
          breakpoint={breakpoint}
          onClick={onOpenBevueModal}
        >
          <Show above={breakpoint}>
            Bévue…
          </Show>
        </HeaderResponsiveButton>
      </>
    )
  }

  function HeaderResponsiveButton({
    colorScheme = "gray",
    breakpoint = "base",
    ...props
  }) {
    return (
      <Button
        //aria-label={text}
        colorScheme={colorScheme}
        justifyContent="flex-start"
        iconSpacing={{ "base": 0, "md": 2 }}
        {...props}
      />
    )
  }

  function BurgerMenu() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const dispatch = useAppDispatch();

    return (
      <>
        <IconButton
          aria-label='burger menu'
          icon={<RxHamburgerMenu />}
          colorScheme="gray"
          onClick={onOpen}
        />
        <Drawer
          isOpen={isOpen}
          placement='right'
          onClose={onClose}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>

            <DrawerBody>
              <VStack
                align="stretch"
              >
                <HeaderButtonsList breakpoint={bpDetect} />

                <Button
                  colorScheme="blue"
                  leftIcon={<HiOutlineSpeakerphone />}
                  onClick={() =>
                    dispatch(resolversSlice.actions.setChanteSloubi({ active: true }))
                  }
                >
                  Chante-Sloubi
                </Button>
              </VStack>
            </DrawerBody>

            <DrawerFooter alignItems="stretch">
              <Button
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

  function BevueModal() {
    const players = useAppSelector(selectPlayerCardDetails)

    return (
      <Modal
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
            >
              {players.map((details, index) => (
                <Button key={index}>
                  {details.player}
                </Button>
              ))}
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseBevueModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }

  return (
    <>
      <Flex
        mx={[2, 4]}
        my={2}
        alignItems="center"
      >
        <Heading fontSize="3xl" className='Cvl_de_Chovette_Header'>Cvl de Chovette</Heading>

        <Spacer />

        <HStack spacing={[1, 2]}>
          <HeaderButtonsList breakpoint="md" />
          <BurgerMenu />
        </HStack>

      </Flex>

      <BevueModal />
    </>
  );

}
