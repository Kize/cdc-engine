import { JSX } from 'react';
import {
  Center,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { ScribeDrawer } from './ScribeDrawer.tsx';

export function ScribePanelHeader(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex mt={2} ml={2}>
        <IconButton
          aria-label="ouvrir le menu d'options"
          boxSize="2.2em"
          icon={<GiHamburgerMenu />}
          fontSize={'1.8em'}
          // variant="ghost"
          variant="outline"
          onClick={onOpen}
        />

        <Center>
          <Heading fontSize="xx-large" pl={6}>
            Cul de Chouette
          </Heading>
        </Center>
      </Flex>

      <ScribeDrawer isOpen={isOpen} onClose={onClose} />
    </>
  );
}
