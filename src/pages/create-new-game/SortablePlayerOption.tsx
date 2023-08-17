import { JSX } from 'react';
import { Box, Flex, IconButton, ListItem } from '@chakra-ui/react';
import { MdDragIndicator } from 'react-icons/md';
import { TiDeleteOutline } from 'react-icons/ti';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

export function SortablePlayerOption({
  onRemove,
  player,
}: {
  player: string;
  onRemove: (player: string) => void;
}): JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: player });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ListItem ref={setNodeRef} style={style} {...attributes}>
      <Flex align="center">
        <IconButton
          aria-label="remove"
          icon={<MdDragIndicator />}
          variant="ghost"
          {...listeners}
        />

        <Box as="span" flexGrow={1} {...listeners}>
          {player}
        </Box>

        <IconButton
          aria-label="remove"
          icon={<TiDeleteOutline />}
          variant="ghost"
          color="grey"
          onClick={() => onRemove(player)}
        />
      </Flex>
    </ListItem>
  );
}
