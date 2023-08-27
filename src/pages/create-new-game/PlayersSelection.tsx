import { JSX, useState } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Box, List } from '@chakra-ui/react';
import { CreatableSelect } from 'chakra-react-select';
import { SortablePlayerOption } from './SortablePlayerOption.tsx';
import { useLocalStorage } from '../../utils/use-local-storage.hook.ts';
import {
  CustomSelectOption,
  sortCustomSelectOptions,
} from '../../utils/custom-select.utils.ts';

export function PlayersSelection(props: {
  maxPlayers: number;
  setPlayers: (players: Array<string>) => void;
}): JSX.Element {
  const [savedPlayers, setSavedPlayers] = useLocalStorage<Array<string>>(
    'players',
    [],
  );

  const [playerOptions, setPlayerOptions] = useState(
    savedPlayers
      .map<CustomSelectOption>((player) => ({
        value: player,
        label: player,
      }))
      .sort(sortCustomSelectOptions),
  );

  const [selectedPlayers, setSelectedPlayers] = useState([] as Array<string>);

  const [selectedOption, setSelectedOption] = useState(null);

  const selectPlayer = (option: CustomSelectOption | null) => {
    if (!option) {
      return;
    }

    setPlayerOptions(
      playerOptions.map((current) =>
        current.value === option.value
          ? {
              ...option,
              isDisabled: true,
            }
          : current,
      ),
    );
    const players = [...selectedPlayers, option.value];
    setSelectedPlayers(players);
    props.setPlayers(players);

    setSelectedOption(null);
  };

  const createPlayer = (value: string) => {
    const players = [...selectedPlayers, value];
    setSelectedPlayers(players);
    props.setPlayers(players);

    setPlayerOptions(
      [...playerOptions, { value, label: value, isDisabled: true }].sort(
        (a, b) => a.value.localeCompare(b.value),
      ),
    );

    setSavedPlayers([...savedPlayers, value].sort());
  };

  const removeSelectedPlayer = (player: string) => {
    const players = selectedPlayers.filter((current) => current !== player);
    setSelectedPlayers(players);
    props.setPlayers(players);

    setPlayerOptions(
      playerOptions.map((current) =>
        current.value === player
          ? {
              ...current,
              isDisabled: false,
            }
          : current,
      ),
    );
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      setSelectedPlayers((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);

        const players = arrayMove(items, oldIndex, newIndex);

        props.setPlayers(players);
        return players;
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <>
      <Box as="span" p={2} display="block">
        Sélectionner de 2 à 8 joueurs:
      </Box>

      <CreatableSelect
        placeholder="Ajouter un joueur"
        value={selectedOption}
        options={playerOptions}
        isDisabled={selectedPlayers.length >= props.maxPlayers}
        onChange={selectPlayer}
        onCreateOption={createPlayer}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={selectedPlayers}
          strategy={verticalListSortingStrategy}
        >
          <List mt={2}>
            {selectedPlayers.map((player) => (
              <SortablePlayerOption
                key={player}
                player={player}
                onRemove={removeSelectedPlayer}
              />
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </>
  );
}
