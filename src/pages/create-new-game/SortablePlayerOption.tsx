import { JSX } from 'react';
import { Box, Flex, Icon, IconButton, ListItem } from '@chakra-ui/react';
import { MdDragIndicator } from 'react-icons/md';
import { TiDeleteOutline } from 'react-icons/ti';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

export function SortablePlayerOption({
  onRemove,
  player,
  index,
}: {
  player: string;
  index: number;
  onRemove: (player: string) => void;
}): JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: player });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ListItem
      flexGrow={1}
      ref={setNodeRef}
      style={style}
      {...attributes}
      mb={2}
      border="1px"
      borderColor={index % 2 === 0 ? 'gray.100' : 'gray.200'}
      borderRadius="4px"
    >
      <Flex align="center">
        <Icon
          aria-label="remove"
          as={MdDragIndicator}
          variant="ghost"
          mx={2}
          {...listeners}
        />

        <Box as="span" fontSize="lg" flexGrow={1} {...listeners}>
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
