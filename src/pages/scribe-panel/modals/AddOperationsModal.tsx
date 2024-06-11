import {
	Button,
	ButtonGroup,
	Card,
	CardBody,
	CardHeader,
	Center,
	Checkbox,
	FormControl,
	FormLabel,
	Heading,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	useBoolean,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { type JSX, useState } from "react";
import type { AddOperationLinesContext } from "../../../../lib/game/add-operations.ts";
import {
	GodModLineType,
	type HistoryLine,
} from "../../../../lib/history/history-line.ts";
import type { Player } from "../../../../lib/player.ts";
import { RuleEffectEvent } from "../../../../lib/rule-runner/rules/rule-effect.ts";
import { ComplexInputNumber } from "../../../components/complex-input-number/ComplexInputNumber.tsx";
import { addOperationsThunk } from "../../../store/current-game/current-game-actions-thunks.ts";
import { selectPlayers } from "../../../store/current-game/current-game-selectors.ts";
import { resolversSlice } from "../../../store/resolvers/resolvers.slice.ts";
import { useAppDispatch, useAppSelector } from "../../../store/store.ts";
import {
	type CustomSelectOption,
	customSelectStyles,
} from "../../../utils/custom-select.utils.ts";

interface OperationLineForm {
	player: Player;
	amount: number | string;
	options: Array<RuleEffectEvent>;
}

const toNewLineForm = (player: Player): OperationLineForm => ({
	player: player,
	options: [],
	amount: 0,
});

export function AddOperationsModal(): JSX.Element {
	const { active } = useAppSelector((state) => state.resolvers.addOperations);
	const players = useAppSelector(selectPlayers);
	const dispatch = useAppDispatch();
	const [lineForms, setLineForms] = useState<Array<OperationLineForm>>(
		players.map<OperationLineForm>(toNewLineForm),
	);
	const [shouldHandleEndTurn, { off, toggle }] = useBoolean(false);

	const updateLineForm = (player: Player) => (lineForm: OperationLineForm) => {
		const newLineForms = lineForms.map((line) => {
			if (line.player === player) {
				return { ...lineForm };
			}

			return { ...line };
		});

		setLineForms(newLineForms);
	};

	const resetForm = () => {
		setLineForms(players.map(toNewLineForm));
		off();
	};

	const onClose = () => {
		dispatch(resolversSlice.actions.setAddOperations({ active: false }));
		resetForm();
	};

	const onValidate = () => {
		const context: AddOperationLinesContext = {
			shouldHandleEndTurn,
			operations: lineForms.reduce<Array<HistoryLine>>(
				(operations, currentLine) => {
					const mainLineActionPayload: Array<HistoryLine> = [];
					const parsedAmount = Number.parseInt(currentLine.amount.toString());
					if (!Number.isNaN(parsedAmount) && parsedAmount !== 0) {
						mainLineActionPayload.push({
							designation: GodModLineType.GOD_MOD,
							player: currentLine.player,
							amount: parsedAmount,
						});
					}

					const optionActionPayloads = currentLine.options.map<HistoryLine>(
						(optionDesignation) => ({
							designation: optionDesignation,
							player: currentLine.player,
							amount: 0,
						}),
					);

					operations.push(...mainLineActionPayload, ...optionActionPayloads);

					return operations;
				},
				[],
			),
		};

		dispatch(addOperationsThunk(context));
		resetForm();
	};

	return (
		<>
			<Modal size="full" isOpen={active} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalHeader color="white" bgColor="green.400">
						Ajouter des opérations
					</ModalHeader>

					<ModalBody>
						<Center mb={4}>
							<Checkbox
								size="lg"
								colorScheme="red"
								color="red"
								isChecked={shouldHandleEndTurn}
								onChange={toggle}
							>
								Passer le tour
							</Checkbox>
						</Center>

						{lineForms.map((lineForm, index) => (
							<LineForm
								key={lineForm.player}
								index={index}
								lineForm={lineForm}
								setLineForm={updateLineForm(lineForm.player)}
							/>
						))}
					</ModalBody>

					<ModalFooter>
						<ButtonGroup spacing={8}>
							<Button onClick={onClose}>Annuler</Button>

							<Button colorScheme="blue" mr={3} onClick={onValidate}>
								Valider
							</Button>
						</ButtonGroup>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

interface LineFormProps {
	lineForm: OperationLineForm;
	index: number;
	setLineForm: (line: OperationLineForm) => void;
}

function LineForm({
	lineForm,
	setLineForm,
	index,
}: LineFormProps): JSX.Element {
	const options: Array<CustomSelectOption> = [
		{
			label: RuleEffectEvent.ADD_GRELOTTINE,
			value: RuleEffectEvent.ADD_GRELOTTINE,
		},
		{
			label: RuleEffectEvent.REMOVE_GRELOTTINE,
			value: RuleEffectEvent.REMOVE_GRELOTTINE,
		},
		{
			label: RuleEffectEvent.ADD_CIVET,
			value: RuleEffectEvent.ADD_CIVET,
		},
		{
			label: RuleEffectEvent.REMOVE_CIVET,
			value: RuleEffectEvent.REMOVE_CIVET,
		},
		{
			label: RuleEffectEvent.ADD_JARRET,
			value: RuleEffectEvent.ADD_JARRET,
		},
		{
			label: RuleEffectEvent.REMOVE_JARRET,
			value: RuleEffectEvent.REMOVE_JARRET,
		},
	];

	const setAmount = (value: number | string): void => {
		const newLine = { ...lineForm, amount: value };

		setLineForm(newLine);
	};

	const optionsForm = lineForm.options.map<CustomSelectOption>((line) => {
		return {
			label: line,
			value: line,
		};
	});

	const onChangeOptions = (items: Array<CustomSelectOption>) => {
		const newLine = {
			...lineForm,
			options: items.map((i) => i.value as RuleEffectEvent),
		};

		setLineForm(newLine);
	};

	return (
		<Card
			mb={[3, 6]}
			size="sm"
			variant="elevated"
			bgColor={`${index % 2 === 0 ? "green" : "lime"}.50`}
		>
			<CardHeader pb={0} pt={1}>
				<Heading size="md">{lineForm.player}</Heading>
			</CardHeader>

			<CardBody p={0} pb={[3, 1]}>
				<Stack direction={["column", "row"]}>
					<FormControl px={1} maxW={["80%", "35%"]} mx="auto" my={[2, 0]}>
						<FormLabel fontSize="xs">Options</FormLabel>

						<Select
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							size="sm"
							isMulti
							isSearchable={false}
							name="options"
							options={options}
							value={optionsForm}
							onChange={(items) => onChangeOptions([...items])}
							{...customSelectStyles}
						/>
					</FormControl>

					<ComplexInputNumber value={lineForm.amount} setValue={setAmount} />
				</Stack>
			</CardBody>
		</Card>
	);
}
