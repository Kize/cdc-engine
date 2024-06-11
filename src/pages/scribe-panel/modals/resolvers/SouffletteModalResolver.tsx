import {
	Button,
	ButtonGroup,
	Flex,
	FormControl,
	FormLabel,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalOverlay,
	Slider,
	SliderFilledTrack,
	SliderMark,
	SliderThumb,
	SliderTrack,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { type JSX, useState } from "react";
import type { DiceRoll } from "../../../../../lib/rule-runner/rules/dice-rule.ts";
import { isDiceRollASoufflette } from "../../../../../lib/rule-runner/rules/level-1/soufflette-rule.ts";
import { BevueModalHeader } from "../../../../components/custom-modal/BevueModalHeader.tsx";
import { OneLineDiceForm } from "../../../../components/dice/OneLineDiceForm.tsx";
import {
	type DiceForm,
	getNewDiceForm,
	isDiceFormValid,
} from "../../../../components/dice/dice-form.ts";
import { selectPlayers } from "../../../../store/current-game/current-game-selectors.ts";
import { souffletteRuleResolver } from "../../../../store/resolvers/rules/soufflette-rule.resolver.ts";
import { useAppSelector } from "../../../../store/store.ts";
import {
	type CustomSelectOption,
	customSelectStyles,
} from "../../../../utils/custom-select.utils.ts";

const labelStyles = {
	mt: "3",
	fontSize: "sm",
};

type DiceRollNumber = 1 | 2 | 3;

export function SouffletteModalResolver(): JSX.Element {
	const { active, player } = useAppSelector(
		(state) => state.resolvers.soufflette,
	);
	const players = useAppSelector(selectPlayers);

	const options = players
		.filter((p) => p !== player)
		.map<CustomSelectOption>((p) => ({ label: p, value: p }));

	const [challengedPlayer, setChallengedPlayer] =
		useState<null | CustomSelectOption>(null);
	const [numberOfDiceRolls, setNumberOfDiceRolls] = useState<DiceRollNumber>(3);
	const [diceForm, setDiceForm] = useState<DiceForm>(getNewDiceForm());

	const isWinningSoufflette = isDiceRollASoufflette(diceForm as DiceRoll);
	const isLostInThreeDiceRolls =
		isDiceFormValid(diceForm) && numberOfDiceRolls === 3;
	const isValidateValid =
		challengedPlayer && (isWinningSoufflette || isLostInThreeDiceRolls);

	const resetForm = () => {
		setChallengedPlayer(null);
		setNumberOfDiceRolls(3);
		setDiceForm(getNewDiceForm());
	};

	const onClose = () => {
		souffletteRuleResolver.reject();
		resetForm();
	};

	const onValidate = (noChallenge: boolean) => {
		if (noChallenge) {
			souffletteRuleResolver.resolve({ isChallenge: false });
		} else if (isDiceFormValid(diceForm) && challengedPlayer) {
			souffletteRuleResolver.resolve({
				isChallenge: true,
				challengedPlayer: challengedPlayer.value,
				diceRoll: diceForm,
				numberOfDiceRolls,
			});
		}
		resetForm();
	};

	return (
		<Modal
			closeOnOverlayClick={false}
			isOpen={active}
			size="xl"
			onClose={onClose}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<BevueModalHeader title={`${player} a réalisé une Soufflette!`} />

				<ModalBody>
					<Flex>
						<FormControl flex={2} px={5}>
							<FormLabel>Joueur défié</FormLabel>

							<Select
								placeholder={options[0]?.label ?? ""}
								value={challengedPlayer}
								options={options}
								onChange={setChallengedPlayer}
								{...customSelectStyles}
							/>
						</FormControl>

						<FormControl flex={1} px={5}>
							<FormLabel fontSize="sm" mb={3}>
								Nombre de lancés
							</FormLabel>

							<Slider
								aria-label="nombre de lancés"
								min={1}
								max={3}
								defaultValue={3}
								size="lg"
								onChangeEnd={(value) =>
									setNumberOfDiceRolls(value as DiceRollNumber)
								}
							>
								<SliderMark value={1} {...labelStyles}>
									1
								</SliderMark>
								<SliderMark value={2} {...labelStyles}>
									2
								</SliderMark>
								<SliderMark value={3} {...labelStyles}>
									3
								</SliderMark>

								<SliderTrack>
									<SliderFilledTrack />
								</SliderTrack>
								<SliderThumb boxSize={5} />
							</Slider>
						</FormControl>
					</Flex>

					<FormControl mt={6}>
						<FormLabel fontSize="sm">
							Combinaison réalisée sur le dernier lancé:
						</FormLabel>

						<OneLineDiceForm
							diceForm={diceForm}
							onChangeForm={(diceForm) => setDiceForm(diceForm)}
						/>
					</FormControl>
				</ModalBody>

				<ModalFooter>
					<ButtonGroup>
						<Button onClick={onClose}>Annuler</Button>

						<Button colorScheme="orange" onClick={() => onValidate(true)}>
							Aucun défi
						</Button>

						<Button
							colorScheme="blue"
							isDisabled={!isValidateValid}
							onClick={() => onValidate(false)}
						>
							Valider
						</Button>
					</ButtonGroup>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
