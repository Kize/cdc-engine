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
	ModalHeader,
	ModalOverlay,
	Stack,
} from "@chakra-ui/react";
import { type JSX, useState } from "react";
import type { Player } from "../../../../../lib/player.ts";
import { BevueModalHeader } from "../../../../components/custom-modal/BevueModalHeader.tsx";
import { selectPlayers } from "../../../../store/current-game/current-game-selectors.ts";
import { chouetteVeluteResolver } from "../../../../store/resolvers/rules/chouette-velute-rule.resolver.ts";
import { useAppSelector } from "../../../../store/store.ts";

export function ChouetteVeluteModalResolver(): JSX.Element {
	const { active, player } = useAppSelector(
		(state) => state.resolvers.chouetteVelute,
	);
	const players = useAppSelector(selectPlayers);

	const [selectedPlayers, setSelectedPlayers] = useState<Array<Player>>([]);

	const onClose = () => {
		setSelectedPlayers([]);
		chouetteVeluteResolver.reject();
	};

	const onValidate = () => {
		chouetteVeluteResolver.resolve({
			players: selectedPlayers,
		});

		setSelectedPlayers([]);
	};

	return (
		<Modal closeOnOverlayClick={false} isOpen={active} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<BevueModalHeader title={`${player} a réalisé une Chouette Velute!`} />

				<ModalHeader>{player} a réalisé une Chouette Velute !</ModalHeader>

				<ModalBody>
					<FormControl as="fieldset">
						<FormLabel as="legend">
							Joueurs ayant disputés la Chouette Velute
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
				</ModalBody>

				<ModalFooter>
					<ButtonGroup>
						<Button onClick={onClose}>Annuler</Button>

						<Button
							colorScheme="blue"
							isDisabled={selectedPlayers.length === 0}
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
