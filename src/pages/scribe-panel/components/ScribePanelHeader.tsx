import { Button, Heading, Icon, Link, SimpleGrid } from '@chakra-ui/react';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { MdCancelPresentation } from 'react-icons/md';

interface Props {
  cancelGame: () => void;
}

export function ScribePanelHeader({ cancelGame }: Props) {
  return (
    <SimpleGrid columns={[2, 4]} mb={[4, 6]} mt={1} mx={4}>
      <Heading fontSize="x-large">Partie en cours</Heading>

      <Link
        pt={2}
        href="https://docs.google.com/document/d/111XDCFHeqVqV-DvnJqJ31rp05tMZbmpxJWQDvPJdIHY/edit#heading=h.kr2581jfe5r"
        isExternal
      >
        Accéder aux règles <Icon mx="2px" as={HiOutlineExternalLink} />
      </Link>

      <Link pt={2} href="/history">
        Afficher l'historique
      </Link>

      <Button
        colorScheme="pink"
        leftIcon={<MdCancelPresentation />}
        onClick={cancelGame}
      >
        Annuler la partie
      </Button>
    </SimpleGrid>
  );
}
