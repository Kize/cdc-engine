import {
	Button,
	ButtonGroup,
	FormControl,
	FormLabel,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalOverlay,
	Radio,
	RadioGroup,
	Stack,
} from "@chakra-ui/react";
import { type JSX, useState } from "react";
import type { Player } from "../../../../../lib/player.ts";
import { BevueModalHeader } from "../../../../components/custom-modal/BevueModalHeader.tsx";
import { selectPlayers } from "../../../../store/current-game/current-game-selectors.ts";
import { culDeChouetteRuleResolver } from "../../../../store/resolvers/rules/cul-de-chouette-rule.resolver.ts";
import { useAppSelector } from "../../../../store/store.ts";

export function CulDeChouetteModalResolver(): JSX.Element {
	const { active, player } = useAppSelector(
		(state) => state.resolvers.culDeChouette,
	);
	const players = useAppSelector(selectPlayers);

	const [selectedPlayer, setSelectedPlayer] = useState("" as Player);

	const onClose = () => {
		culDeChouetteRuleResolver.reject();
		resetForm();
	};

	const onValidate = () => {
		culDeChouetteRuleResolver.resolve({ claimingPlayer: selectedPlayer });
		resetForm();
	};

	const resetForm = () => {
		setSelectedPlayer("");
	};

	return (
		<Modal
			closeOnOverlayClick={false}
			isOpen={active}
			onClose={onClose}
			size="xl"
		>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<BevueModalHeader
					title={`${player} a réalisé un Cul de Chouette !!!`}
				/>

				<ModalBody>
					<FormControl as="fieldset">
						<FormLabel as="legend">
							Joueur ayant crié son annonce en premier:
						</FormLabel>

						<RadioGroup onChange={setSelectedPlayer} value={selectedPlayer}>
							<Stack>
								{players.map((player) => (
									<Radio value={player} key={player} size="lg" mb={2}>
										{player}
									</Radio>
								))}
							</Stack>
						</RadioGroup>
					</FormControl>
				</ModalBody>

				<ModalFooter>
					<ButtonGroup>
						<Button onClick={onClose}>Annuler</Button>

						<Button
							colorScheme="blue"
							isDisabled={!selectedPlayer}
							onClick={onValidate}
						>
							Valider
						</Button>
					</ButtonGroup>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
