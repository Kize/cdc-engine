import { JSX } from 'react';
import { useAppSelector } from '../../../store/store.ts';
import {
  Button,
  Container,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
} from '@chakra-ui/react';
import { artichetteRuleResolver } from '../../../store/resolvers/rules/artichette-rule.resolver.ts';

export function ArtichetteModalResolver(): JSX.Element {
  const { active, player } = useAppSelector(
    (state) => state.resolvers.artichette,
  );

  const onClose = () => {
    artichetteRuleResolver.reject();
  };

  const onValidate = (isRaitournelleClaimed: boolean) => {
    artichetteRuleResolver.resolve({ isRaitournelleClaimed });
  };

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={active} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>{player} a réalisé une Artichette</ModalHeader>

          <ModalBody>
            <Container p={8}>
              <SimpleGrid columns={[1, 2]} spacingX={8} spacingY={4}>
                <Button
                  colorScheme="orange"
                  size="lg"
                  onClick={() => onValidate(false)}
                >
                  Artichette!
                </Button>

                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={() => onValidate(true)}
                >
                  Raitournelle!
                </Button>
              </SimpleGrid>
            </Container>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
