import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { JSX } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store.ts';
import { selectPlayers } from '../../store/current-game/current-game-selectors.ts';
import { FaThumbsDown } from 'react-icons/fa';
import { Player } from '../../../lib/player.ts';
import { applyBevueThunk } from '../../store/current-game/current-game-actions-thunks.ts';

export function BevueSelectorButton(): JSX.Element {
  const players = useAppSelector(selectPlayers);
  const dispatch = useAppDispatch();

  const applyBevue = async (player: Player) => {
    await dispatch(applyBevueThunk(player));
  };

  return (
    <Menu>
      <MenuButton as={Button} colorScheme="red" rightIcon={<FaThumbsDown />}>
        Bévue
      </MenuButton>

      <MenuList>
        {players.map((player) => (
          <MenuItem onClick={() => applyBevue(player)}>{player}</MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
