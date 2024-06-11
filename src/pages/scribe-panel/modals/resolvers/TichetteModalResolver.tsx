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
	Stack,
} from "@chakra-ui/react";
import { type JSX, useState } from "react";
import type { Player } from "../../../../../lib/player.ts";
import { BevueModalHeader } from "../../../../components/custom-modal/BevueModalHeader.tsx";
import { selectPlayerCardDetails } from "../../../../store/current-game/current-game-selectors.ts";
import { tichetteRuleResolver } from "../../../../store/resolvers/rules/tichette-rule.resolver.ts";
import { useAppSelector } from "../../../../store/store.ts";

export function TichetteModalResolver(): JSX.Element {
	const { active, player, canClaimRobobrol } = useAppSelector(
		(state) => state.resolvers.tichette,
	);
	const playersDetails = useAppSelector(selectPlayerCardDetails);
	const [selectedPlayers, setSelectedPlayers] = useState<Array<Player>>([]);
	const [hasClaimedRobobrol, setHasClaimedRobobrol] = useState<boolean>(false);

	const onClose = () => {
		setSelectedPlayers([]);
		setHasClaimedRobobrol(false);
		tichetteRuleResolver.reject();
	};

	const onValidate = () => {
		tichetteRuleResolver.resolve({
			playersWhoClaimedTichette: playersDetails.filter(({ player }) =>
				selectedPlayers.includes(player),
			),
			hasClaimedRobobrol,
		});

		setSelectedPlayers([]);
		setHasClaimedRobobrol(false);
	};

	return (
		<Modal closeOnOverlayClick={false} isOpen={active} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<BevueModalHeader title={`${player} a réalisé une Tichette!`} />

				<ModalBody>
					<FormControl as="fieldset">
						<FormLabel as="legend">
							Joueurs ayant clamant la Tichette (ou le Robobrol)
						</FormLabel>

						<CheckboxGroup
							value={selectedPlayers}
							onChange={(values: Array<Player>) => setSelectedPlayers(values)}
						>
							<Stack>
								{playersDetails.map(({ player }) => (
									<Checkbox value={player} key={player} size="lg" mb={2}>
										{player}
									</Checkbox>
								))}
							</Stack>
						</CheckboxGroup>
					</FormControl>

					{canClaimRobobrol && (
						<FormControl mt={8}>
							<FormLabel as="legend">Annonce de Robobrol</FormLabel>

							<Checkbox
								size="lg"
								isChecked={hasClaimedRobobrol}
								onChange={() => setHasClaimedRobobrol(!hasClaimedRobobrol)}
							>
								Robobrol annoncé
							</Checkbox>
						</FormControl>
					)}
				</ModalBody>

				<ModalFooter>
					<ButtonGroup>
						<Button onClick={onClose}>Annuler</Button>

						<Button
							colorScheme={selectedPlayers.length === 0 ? "orange" : "blue"}
							onClick={onValidate}
						>
							{selectedPlayers.length === 0
								? "Pas de Tichette"
								: "Valider la Tichette"}
						</Button>
					</ButtonGroup>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
