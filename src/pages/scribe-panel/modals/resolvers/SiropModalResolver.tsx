import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Checkbox,
	CheckboxGroup,
	Container,
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
	SimpleGrid,
	Stack,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { type JSX, useEffect, useState } from "react";
import {
	type Player,
	sortPlayersStartingBy,
} from "../../../../../lib/player.ts";
import {
	BidType,
	type PlayableBid,
	type SiropBid,
	dieValueToBidType,
} from "../../../../../lib/rule-runner/rules/level-1/sirotage-rule.types.ts";
import { BevueModalHeader } from "../../../../components/custom-modal/BevueModalHeader.tsx";
import { DieInput } from "../../../../components/dice/DieInput.tsx";
import type { OptionalDieValue } from "../../../../components/dice/dice-form.ts";
import { selectPlayers } from "../../../../store/current-game/current-game-selectors.ts";
import { attrapeOiseauRuleResolver } from "../../../../store/resolvers/rules/attrape-oiseau-rule.resolver.ts";
import { siropRuleResolver } from "../../../../store/resolvers/rules/sirop-rule.resolver.ts";
import { useAppSelector } from "../../../../store/store.ts";
import {
	type CustomSelectOption,
	customSelectStyles,
} from "../../../../utils/custom-select.utils.ts";

const getNewBidForm = (player: Player) => ({
	player,
	playerBid: "" as BidType,
	isBidValidated: false,
});

export function SiropModalResolver(): JSX.Element {
	const { active, player, chouetteValue, playableBids } = useAppSelector(
		(state) => state.resolvers.sirop,
	);

	const isAttrapeOiseauEnabled = useAppSelector(
		(state) => state.currentGame.rulesConfiguration.isAttrapeOiseauEnabled,
	);

	const players = useAppSelector(selectPlayers);
	const attrapeOiseauOptions = players
		.filter((p) => p !== player)
		.map<CustomSelectOption>((player) => ({
			label: player,
			value: player,
		}));

	const [selectedAttrapeOiseau, setSelectedAttrapeOiseau] =
		useState<CustomSelectOption | null>(null);
	const [bids, setBids] = useState<Array<SiropBid>>(
		sortPlayersStartingBy(players, player).map(getNewBidForm),
	);
	const [dieValue, setDieValue] = useState<OptionalDieValue>(null);
	const [validatedPlayers, setValidatedPlayers] = useState<Array<Player>>([]);

	useEffect(() => {
		const orderedPlayersForBets = selectedAttrapeOiseau
			? sortPlayersStartingBy(players, selectedAttrapeOiseau.value)
			: sortPlayersStartingBy(players, player);

		setBids(orderedPlayersForBets.map(getNewBidForm));
	}, [selectedAttrapeOiseau, players, player]);

	const isFormValid =
		dieValue !== null && bids.every((bid) => (bid.playerBid as string) !== "");

	const enabledBids = playableBids.map<PlayableBid>((bid) => {
		let disabled: boolean;
		switch (bid.type) {
			case BidType.COUCHE_SIROP:
				disabled = !!selectedAttrapeOiseau;
				break;
			case BidType.FILE_SIROP:
				disabled = !selectedAttrapeOiseau;
				break;
			default:
				disabled = !bid.isPlayable;
		}

		return {
			type: bid.type,
			isPlayable: !disabled,
		};
	});

	const selectDie = (value: OptionalDieValue): OptionalDieValue => {
		setDieValue(value);
		return value;
	};

	const resetForm = () => {
		setSelectedAttrapeOiseau(null);
		setDieValue(null);
		setValidatedPlayers([]);
		setBids([]);
	};

	const onClose = () => {
		if (isAttrapeOiseauEnabled) {
			attrapeOiseauRuleResolver.reject();
		} else {
			siropRuleResolver.reject();
		}

		resetForm();
	};

	const onValidate = (isSirote: boolean) => {
		const resolver = isAttrapeOiseauEnabled
			? attrapeOiseauRuleResolver
			: siropRuleResolver;

		if (!isSirote) {
			resolver.resolve({ isSirote: false });
		} else if (isFormValid) {
			resolver.resolve({
				isSirote: true,
				playerWhoMakeAttrapeOiseau: selectedAttrapeOiseau?.value,
				lastDieValue: dieValue,
				bids: bids.map(({ player, playerBid }) => ({
					player,
					playerBid,
					isBidValidated: validatedPlayers.includes(player),
				})),
			});
		}

		resetForm();
	};

	const selectedABet = (playerBid: BidType, player: Player): void => {
		const newBids = bids.map((bidForm) => {
			if (bidForm.player === player) {
				return { ...bidForm, playerBid };
			}

			return { ...bidForm };
		});

		setBids(newBids);
	};

	const isSiropGagnantInputDisabled = (bidForm: SiropBid): boolean => {
		if (!dieValue) {
			return true;
		}

		const hasBetValidBeauSirop =
			bidForm.playerBid === BidType.BEAU_SIROP && dieValue === chouetteValue;
		const hasBetRightValue =
			bidForm.playerBid === dieValueToBidType.get(dieValue);

		return !(hasBetValidBeauSirop || hasBetRightValue);
	};

	const cardsProps = {
		size: "sm",
		mb: 2,
	};

	return (
		<Modal
			closeOnOverlayClick={false}
			isOpen={active}
			size="full"
			onClose={onClose}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<BevueModalHeader
					title={`${player} a réalisé une Chouette de ${chouetteValue}!`}
				/>

				<ModalBody>
					{isAttrapeOiseauEnabled && (
						<Card {...cardsProps}>
							<CardHeader pb={0} color="blue">
								Attrape-Oiseau
							</CardHeader>

							<CardBody pt={0}>
								<Container>
									<Select
										isClearable
										placeholder={attrapeOiseauOptions[0]?.label ?? ""}
										value={selectedAttrapeOiseau}
										options={attrapeOiseauOptions}
										onChange={setSelectedAttrapeOiseau}
										{...customSelectStyles}
									/>
								</Container>
							</CardBody>
						</Card>
					)}

					<Card {...cardsProps}>
						<CardHeader pb={0} color="blue">
							Annonces:
						</CardHeader>

						<CardBody pt={0}>
							<SimpleGrid columns={[2, bids.length]} spacingY={4}>
								{bids.map((bidForm) => (
									<FormControl as="fieldset" key={bidForm.player}>
										<FormLabel as="legend">{bidForm.player}</FormLabel>

										<RadioGroup
											value={bidForm.playerBid}
											onChange={(bet: BidType) =>
												selectedABet(bet, bidForm.player)
											}
										>
											<Stack spacing={0}>
												{enabledBids.map((bid) => (
													<Radio
														value={bid.type}
														key={bid.type}
														isDisabled={!bid.isPlayable}
														variant="filled"
													>
														{bid.type}
													</Radio>
												))}
											</Stack>
										</RadioGroup>
									</FormControl>
								))}
							</SimpleGrid>
						</CardBody>
					</Card>

					<Card {...cardsProps}>
						<CardHeader pb={0} color="blue">
							Résultat du dé siroté:
						</CardHeader>

						<CardBody>
							<Container maxW="25em">
								<DieInput dieValue={dieValue} selectDie={selectDie} />
							</Container>
						</CardBody>
					</Card>

					<Card {...cardsProps}>
						<CardHeader pb={0} color="blue">
							Validation des annonces:
						</CardHeader>

						<CardBody mb={2}>
							<SimpleGrid columns={[1, bids.length]}>
								<CheckboxGroup
									value={validatedPlayers}
									onChange={(values: Array<Player>) =>
										setValidatedPlayers(values)
									}
								>
									{bids.map((bidForm) => (
										<Checkbox
											value={bidForm.player}
											key={bidForm.player}
											isDisabled={isSiropGagnantInputDisabled(bidForm)}
											size="sm"
											fontWeight={
												isSiropGagnantInputDisabled(bidForm)
													? "normal"
													: "extrabold"
											}
										>
											{bidForm.player} a crié "Sirop-Gagnant!"
										</Checkbox>
									))}
								</CheckboxGroup>
							</SimpleGrid>
						</CardBody>
					</Card>
				</ModalBody>

				<ModalFooter>
					<Stack
						direction={["column-reverse", "row"]}
						m={["auto", "initial"]}
						spacing={[8, 10]}
					>
						<Button onClick={onClose}>Annuler</Button>

						<Button colorScheme="orange" onClick={() => onValidate(false)}>
							Aucun sirotage
						</Button>

						<Button
							colorScheme="blue"
							isDisabled={!isFormValid}
							onClick={() => onValidate(true)}
						>
							Valider
						</Button>
					</Stack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
