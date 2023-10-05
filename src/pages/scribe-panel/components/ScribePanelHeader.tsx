import { Box, Heading, Icon, Link, SimpleGrid } from '@chakra-ui/react';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { Link as RouterLink } from 'react-router-dom';
import { CancelGameButton } from './CancelGameButton.tsx';

export function ScribePanelHeader() {
  return (
    <SimpleGrid columns={[2, 4]} spacing={2} mb={[4, 6]} mt={1} mx={4}>
      <Heading fontSize="x-large">Partie en cours</Heading>

      <Link
        pt={2}
        href="https://docs.google.com/document/d/111XDCFHeqVqV-DvnJqJ31rp05tMZbmpxJWQDvPJdIHY/edit#heading=h.kr2581jfe5r"
        isExternal
      >
        Accéder aux règles <Icon mx="2px" as={HiOutlineExternalLink} />
      </Link>

      <Box pt={2}>
        <RouterLink to="/history">Afficher l'historique</RouterLink>
      </Box>

      <CancelGameButton />
    </SimpleGrid>
  );
}
