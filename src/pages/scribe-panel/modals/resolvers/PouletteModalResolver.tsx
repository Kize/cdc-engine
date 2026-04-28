import {
	Button,
	ButtonGroup,
	Checkbox,
	CheckboxGroup,
	Heading,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalOverlay,
	Stack,
	Text,
	VStack,
	Icon,
} from "@chakra-ui/react";
import { type JSX, useState } from "react";
import { GiChicken } from "react-icons/gi";
import type { Player } from "../../../../../lib/player.ts";
import { useAppDispatch, useAppSelector } from "../../../../store/store.ts";
import { pouletteRuleResolver } from "../../../../store/resolvers/rules/poulette-rule.resolver.ts";
import { resolversSlice } from "../../../../store/resolvers/resolvers.slice.ts";

export function PouletteModalResolver(): JSX.Element {
	const dispatch = useAppDispatch();
	const { active, isPouletteStep, players, grelottineData } = useAppSelector(
		(state) => state.resolvers.poulette,
	);

	const [selectedPoulettePlayers, setSelectedPoulettePlayers] = useState<
		Array<Player>
	>([]);

	// console.log("selectedPoulettePlayers", selectedPoulettePlayers);

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
				grelottineData: undefined,
			}),
		);
	};

	const onValidate = () => {
		if (grelottineData) {
			pouletteRuleResolver.resolve({
				...grelottineData,
				poulettePlayers: selectedPoulettePlayers,
			});
			resetForm();
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
			<ModalOverlay backdropFilter="blur(8px) brightness(0.8)" />
			<ModalContent
				borderRadius="3xl"
				overflow="hidden"
				boxShadow="2xl"
				bg="white"
			>
				<ModalBody px={8} py={12}>
					<VStack spacing={8} textAlign="center">
						<Icon as={GiChicken} w={16} h={16} color="orange.400" />
						<VStack spacing={2}>
							<Heading fontSize="3xl" color="gray.800">
								Elle est où la poulette ?
							</Heading>
							<Text color="gray.500" fontSize="lg">
								Sélectionnez le(s) joueur(s) qui a/ont crié la phrase.
							</Text>
						</VStack>

						<CheckboxGroup
							colorScheme="orange"
							value={selectedPoulettePlayers}
							onChange={(values) =>
								setSelectedPoulettePlayers(values as Array<Player>)
							}
						>
							<Stack spacing={8} direction="row" justify="center">
								{players.map((player) => (
									<Checkbox
										key={player}
										value={player}
										size="lg"
										sx={{
											".chakra-checkbox__control": {
												borderRadius: "xl",
												width: "32px",
												height: "32px",
											},
											".chakra-checkbox__label": {
												fontSize: "2xl",
												fontWeight: "bold",
												ml: 4,
											},
										}}
									>
										{player}
									</Checkbox>
								))}
							</Stack>
						</CheckboxGroup>
					</VStack>
				</ModalBody>

				<ModalFooter bg="gray.50" px={8} py={8}>
					<ButtonGroup spacing={6} width="full">
						<Button
							onClick={onClose}
							variant="ghost"
							flex={1}
							size="lg"
							borderRadius="2xl"
							_hover={{
								transform: "translateY(-2px)",
							}}
						>
							Annuler
						</Button>

						<Button
							colorScheme="orange"
							onClick={onValidate}
							flex={2}
							size="lg"
							borderRadius="2xl"
							_hover={{
								transform: "translateY(-2px)",
							}}
						>
							Valider la poulette
						</Button>
					</ButtonGroup>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
