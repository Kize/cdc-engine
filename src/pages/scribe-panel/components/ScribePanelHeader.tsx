import { JSX } from 'react';
import {
  Center,
  Flex,
  Heading,
  IconButton,
  Spacer,
  Tag,
  useDisclosure,
} from '@chakra-ui/react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { ScribeDrawer } from './ScribeDrawer.tsx';
import { useAppSelector } from '../../../store/store.ts';

export function ScribePanelHeader(): JSX.Element {
  const isDoublette = useAppSelector((state) => state.currentGame.isDoublette);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex mt={2} mx={2}>
        <Center>
          <Heading fontSize="xx-large" pl={6}>
            <span>Cul de Chouette</span>
            {isDoublette && (
              <Tag size="md" colorScheme="green" m={3}>
                Doublette
              </Tag>
            )}
            {!isDoublette && (
              <Tag size="md" colorScheme="gray" m={3}>
                Chacun pour soi
              </Tag>
            )}
          </Heading>
        </Center>

        <Spacer />

        <IconButton
          aria-label="ouvrir le menu d'options"
          boxSize="2.2em"
          icon={<GiHamburgerMenu />}
          fontSize={'1.8em'}
          variant="outline"
          onClick={onOpen}
        />
      </Flex>

      <ScribeDrawer
        isOpen={isOpen}
        onClose={onClose}
        isDoublette={isDoublette}
      />
    </>
  );
}
