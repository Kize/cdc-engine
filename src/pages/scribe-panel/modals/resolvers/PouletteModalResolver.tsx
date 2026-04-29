import {
	Button,
	ButtonGroup,
	Checkbox,
	CheckboxGroup,
	FormLabel,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalOverlay,
	SimpleGrid,
	VStack,
	Icon,
} from "@chakra-ui/react";
import { type JSX, useState } from "react";
import { GiChicken } from "react-icons/gi";
import type { Player } from "../../../../../lib/player.ts";
import { useAppDispatch, useAppSelector } from "../../../../store/store.ts";
import { BevueModalHeader } from "../../../../components/custom-modal/BevueModalHeader.tsx";
import { pouletteRuleResolver } from "../../../../store/resolvers/rules/poulette-rule.resolver.ts";
import { resolversSlice } from "../../../../store/resolvers/resolvers.slice.ts";

export function PouletteModalResolver(): JSX.Element {
	const dispatch = useAppDispatch();
	const { active, isPouletteStep, players } = useAppSelector(
		(state) => state.resolvers.poulette,
	);

	const [selectedPoulettePlayers, setSelectedPoulettePlayers] = useState<
		Array<Player>
	>([]);

	const isOpen = active && isPouletteStep;

	const onClose = () => {
		pouletteRuleResolver.reject();
		resetForm();
	};

	const resetForm = () => {
		setSelectedPoulettePlayers([]);
		dispatch(
			resolversSlice.actions.setPoulette({
				active: false,
				players: [],
				isPouletteStep: false,
			}),
		);
	};

	const onValidate = () => {
		pouletteRuleResolver.resolve({
			poulettePlayers: selectedPoulettePlayers,
		});
		resetForm();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="xl">
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<BevueModalHeader
					title="Elle est où la poulette ?"
				/>
				<ModalBody>
					<VStack spacing={2} align="stretch">
						<VStack spacing={4} align="center">
							<Icon as={GiChicken} w={8} h={8} color="orange.400" />
							<FormLabel textAlign="center" m={0} fontSize="lg" fontWeight="semibold">
								Sélectionnez le(s) joueur(s) qui a/ont crié la phrase.
							</FormLabel>
						</VStack>
						

						<CheckboxGroup
							colorScheme="orange"
							value={selectedPoulettePlayers}
							onChange={(values) =>
								setSelectedPoulettePlayers(values as Array<Player>)
							}
						>
							<SimpleGrid spacing={4} px={4}>
								{players.map((player) => (
									<Checkbox
										key={player}
										value={player}
										size="lg"
									>
										{player}
									</Checkbox>
								))}
							</SimpleGrid>
						</CheckboxGroup>
					</VStack>
				</ModalBody>

				<ModalFooter>
					<ButtonGroup>
						<Button onClick={onClose}>Annuler</Button>

						<Button
							colorScheme="orange"
							onClick={onValidate}
						>
							Valider la poulette
						</Button>
					</ButtonGroup>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
