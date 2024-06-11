import {
	Box,
	Button,
	ButtonGroup,
	Card,
	CardBody,
	CardHeader,
	Center,
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
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	SimpleGrid,
	Stack,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { type JSX, useState } from "react";
import type { Player } from "../../../../../lib/player.ts";
import type { DieValue } from "../../../../../lib/rule-runner/rules/dice-rule.ts";
import { CivetBet } from "../../../../../lib/rule-runner/rules/level-1/civet-rule.ts";
import { isVerdierApplicable } from "../../../../../lib/rule-runner/rules/level-3/verdier-rule.ts";
import { BevueModalHeader } from "../../../../components/custom-modal/BevueModalHeader.tsx";
import { OneLineDiceForm } from "../../../../components/dice/OneLineDiceForm.tsx";
import {
	type DiceForm,
	getNewDiceForm,
	isDiceFormValid,
} from "../../../../components/dice/dice-form.ts";
import { selectPlayerCardDetails } from "../../../../store/current-game/current-game-selectors.ts";
import { civetDoubleRuleResolver } from "../../../../store/resolvers/rules/civet-double-rule.resolver.ts";
import { civetRuleResolver } from "../../../../store/resolvers/rules/civet-rule.resolver.ts";
import { useAppSelector } from "../../../../store/store.ts";
import {
	type CustomSelectOption,
	customSelectStyles,
} from "../../../../utils/custom-select.utils.ts";

export function CivetModalResolver(): JSX.Element {
	const { active, player } = useAppSelector((state) => state.resolvers.civet);
	const otherPlayersWithCivet = useAppSelector(selectPlayerCardDetails)
		.filter(
			(playerDetails) =>
				player !== playerDetails.player && playerDetails.hasCivet,
		)
		.map((details) => details.player);

	const isCivetDoubleEnabled = useAppSelector(
		(state) => state.currentGame.rulesConfiguration.isCivetDoubleEnabled,
	);

	const resolver = isCivetDoubleEnabled
		? civetDoubleRuleResolver
		: civetRuleResolver;

	const [otherBettingPlayers, setOtherBettingPlayers] = useState<Array<Player>>(
		[],
	);

	const isVerdierRuleEnabled = useAppSelector(
		(state) => state.currentGame.rulesConfiguration.isVerdierEnabled,
	);

	const [selectedBet, setSelectedBet] = useState<CustomSelectOption | null>(
		null,
	);
	const [amount, setAmount] = useState<number>(102);
	const [diceForm, setDiceForm] = useState<DiceForm>(getNewDiceForm());

	const options = Object.values(CivetBet).map<CustomSelectOption>((value) => ({
		label: value,
		value,
	}));

	const isVerdierActivable =
		isVerdierApplicable(diceForm) && selectedBet !== null;
	const isFormValid = selectedBet !== null && isDiceFormValid(diceForm);

	const resetForm = () => {
		setDiceForm(getNewDiceForm());
		setAmount(102);
		setSelectedBet(null);
		setOtherBettingPlayers([]);
	};

	const onClose = () => {
		resolver.reject();
		resetForm();
	};

	const onValidate = () => {
		if (isFormValid) {
			resolver.resolve({
				isVerdier: false,
				playerBet: selectedBet.value as CivetBet,
				diceRoll: diceForm,
				betAmount: amount,
				otherBettingPlayers,
			});
			resetForm();
		}
	};

	const playCivet = () => {
		if (isVerdierActivable) {
			resolver.resolve({
				isVerdier: true,
				betAmount: amount,
				playerBet: selectedBet.value as CivetBet,
				diceValues: diceForm.filter((value) => value !== null) as [
					DieValue,
					DieValue,
				],
				otherBettingPlayers,
			});
		}
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
				<BevueModalHeader title={`${player} utilise son Civet`} />

				<ModalBody>
					<Card mb={6}>
						<CardHeader fontSize="sm" py={2}>
							Annonce:
						</CardHeader>

						<CardBody pt={0}>
							<SimpleGrid columns={2}>
								<FormControl>
									<FormLabel fontSize="xs">Défi:</FormLabel>

									<Select
										placeholder={options[0]?.label ?? ""}
										value={selectedBet}
										options={options}
										onChange={setSelectedBet}
										{...customSelectStyles}
									/>
								</FormControl>

								<Center>
									<FormControl w="initial">
										<FormLabel fontSize="xs">Montant</FormLabel>

										<NumberInput
											maxW={24}
											min={1}
											max={102}
											value={amount}
											onChange={(_, value) => setAmount(value)}
										>
											<NumberInputField />
											<NumberInputStepper>
												<NumberIncrementStepper />
												<NumberDecrementStepper />
											</NumberInputStepper>
										</NumberInput>
									</FormControl>
								</Center>
							</SimpleGrid>
						</CardBody>
					</Card>

					{isCivetDoubleEnabled && otherPlayersWithCivet.length > 0 && (
						<Card mb={6}>
							<CardHeader fontSize="sm" py={2}>
								Civet Doublé:
							</CardHeader>

							<CardBody pt={0}>
								<CheckboxGroup
									value={otherBettingPlayers}
									onChange={(values: Array<Player>) =>
										setOtherBettingPlayers(values)
									}
								>
									<Stack>
										{otherPlayersWithCivet.map((player) => (
											<Checkbox value={player} key={player} size="lg" mb={2}>
												{player}
											</Checkbox>
										))}
									</Stack>
								</CheckboxGroup>
							</CardBody>
						</Card>
					)}

					<Card>
						<CardHeader fontSize="sm" py={2}>
							<Box as="span">Combinaison réalisée:</Box>

							<Button
								aria-label="Jouer un verdier"
								colorScheme="green"
								variant="outline"
								size="sm"
								mx={3}
								borderRadius="full"
								hidden={!isVerdierRuleEnabled}
								isDisabled={!isVerdierActivable}
								onClick={playCivet}
							>
								Verdier
							</Button>
						</CardHeader>

						<CardBody py={0}>
							<OneLineDiceForm
								diceForm={diceForm}
								onChangeForm={(diceForm) => setDiceForm(diceForm)}
							/>
						</CardBody>
					</Card>
				</ModalBody>

				<ModalFooter>
					<ButtonGroup>
						<Button onClick={onClose}>Annuler</Button>

						<Button
							colorScheme="blue"
							isDisabled={!isFormValid}
							onClick={() => onValidate()}
						>
							Valider
						</Button>
					</ButtonGroup>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
