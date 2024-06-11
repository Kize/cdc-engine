import {
	Button,
	ButtonGroup,
	Checkbox,
	CheckboxGroup,
	FormControl,
	FormLabel,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalOverlay,
	SimpleGrid,
	Stack,
} from "@chakra-ui/react";
import { type JSX, useState } from "react";
import type { Player } from "../../../../../lib/player.ts";
import { BevueModalHeader } from "../../../../components/custom-modal/BevueModalHeader.tsx";
import { DieFace } from "../../../../components/dice/DieFace.tsx";
import { DieInput } from "../../../../components/dice/DieInput.tsx";
import type { OptionalDieValue } from "../../../../components/dice/dice-form.ts";
import { selectPlayers } from "../../../../store/current-game/current-game-selectors.ts";
import { verdierRuleResolver } from "../../../../store/resolvers/rules/verdier-rule.resolver.ts";
import { useAppSelector } from "../../../../store/store.ts";

export function VerdierModalResolver(): JSX.Element {
	const { active, diceValues } = useAppSelector(
		(state) => state.resolvers.verdier,
	);
	const players = useAppSelector(selectPlayers);

	const [selectedPlayers, setSelectedPlayers] = useState<Array<Player>>([]);

	const [lastDieValue, setLastDieValue] = useState<OptionalDieValue>(null);

	const onClose = () => {
		setSelectedPlayers([]);
		setLastDieValue(null);

		verdierRuleResolver.reject();
	};

	const onValidate = () => {
		if (lastDieValue !== null) {
			verdierRuleResolver.resolve({
				bettingPlayers: selectedPlayers,
				lastDieValue,
			});

			setSelectedPlayers([]);
			setLastDieValue(null);
		}
	};

	const selectLastDie = (dieValue: OptionalDieValue) => {
		setLastDieValue(dieValue);

		return dieValue;
	};

	return (
		<Modal closeOnOverlayClick={false} isOpen={active} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<BevueModalHeader title={"Verdier"} />

				<ModalBody>
					<FormControl as="fieldset">
						<FormLabel as="legend">
							Joueurs ayants crié "Vert-Linette!"
						</FormLabel>

						<CheckboxGroup
							value={selectedPlayers}
							onChange={(values: Array<Player>) => setSelectedPlayers(values)}
						>
							<Stack>
								{players.map((player) => (
									<Checkbox value={player} key={player} size="lg" mb={2}>
										{player}
									</Checkbox>
								))}
							</Stack>
						</CheckboxGroup>
					</FormControl>

					<SimpleGrid columns={2} maxW="40%" spacingX={8} mx="auto">
						<DieFace dieValue={diceValues[0]} disabled={true} />
						<DieFace dieValue={diceValues[1]} disabled={true} />
					</SimpleGrid>

					<FormControl as="fieldset">
						<FormLabel as="legend">Dernier dé</FormLabel>

						<DieInput dieValue={lastDieValue} selectDie={selectLastDie} />
					</FormControl>
				</ModalBody>

				<ModalFooter>
					<ButtonGroup>
						<Button onClick={onClose}>Annuler</Button>

						<Button
							colorScheme="blue"
							onClick={onValidate}
							isDisabled={lastDieValue === null}
						>
							Valider
						</Button>
					</ButtonGroup>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
