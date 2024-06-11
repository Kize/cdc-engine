import { Stack } from "@chakra-ui/react";
import type { JSX } from "react";
import { DieInput } from "./DieInput.tsx";
import type { DiceForm, OptionalDieValue } from "./dice-form.ts";

interface DiceFormProps {
	diceForm: DiceForm;
	onChangeForm: (form: DiceForm) => void;
}

export function TripleDiceForm({
	diceForm,
	onChangeForm,
}: DiceFormProps): JSX.Element {
	const selectDie =
		(index: number) =>
		(dieValue: OptionalDieValue): void => {
			const newForm = [...diceForm] as DiceForm;
			newForm[index] = dieValue;
			onChangeForm(newForm);
		};

	return (
		<Stack>
			{diceForm.map((dieValue, index) => (
				<DieInput
					key={dieValue}
					dieValue={dieValue}
					selectDie={selectDie(index)}
				/>
			))}
		</Stack>
	);
}
