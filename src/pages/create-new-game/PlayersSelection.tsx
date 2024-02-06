import { JSX, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Center,
  Flex,
  FormControl,
  FormLabel,
  List,
  Switch,
} from '@chakra-ui/react';
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
  isDoublette: boolean;
  toggleIsDoublette: () => void;
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

  return (
    <>
      <FormControl>
        <Center>
          <FormLabel>Mode doublette</FormLabel>

          <Switch
            size="lg"
            colorScheme="green"
            onChange={() => props.toggleIsDoublette()}
          />
        </Center>
      </FormControl>

      <Box as="span" p={2} display="block">
        Sélectionner de 2 à 8 joueurs:
      </Box>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={selectedPlayers}
          strategy={verticalListSortingStrategy}
        >
          <List mt={2}>
            {selectedPlayers.map((player, index) => (
              <Flex key={player} align="baseline">
                <Box
                  as="span"
                  fontSize="lg"
                  px={4}
                  color={`blue.${index + 3}00`}
                >
                  {index + 1}
                </Box>

                <SortablePlayerOption
                  player={player}
                  index={index}
                  onRemove={removeSelectedPlayer}
                />
              </Flex>
            ))}
          </List>
        </SortableContext>
      </DndContext>

      <CreatableSelect
        placeholder="Ajouter un joueur"
        value={selectedOption}
        options={playerOptions}
        isDisabled={selectedPlayers.length >= props.maxPlayers}
        onChange={selectPlayer}
        onCreateOption={createPlayer}
      />

      {props.isDoublette && selectedPlayers.length < 4 && (
        <Alert status="error" mt={2}>
          <AlertIcon />
          <AlertDescription>4 joueurs minimum</AlertDescription>
        </Alert>
      )}
      {props.isDoublette && selectedPlayers.length % 2 !== 0 && (
        <Alert status="error" mt={2}>
          <AlertIcon />
          <AlertDescription>
            Un nombre pair de joueurs est requis à la Doublette.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
