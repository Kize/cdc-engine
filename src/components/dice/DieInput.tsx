import { SimpleGrid } from "@chakra-ui/react";
import type { JSX } from "react";
import type { DieValue } from "../../../lib/rule-runner/rules/dice-rule.ts";
import { DieFace } from "./DieFace.tsx";
import type { OptionalDieValue } from "./dice-form.ts";

interface DieInputProps {
	dieValue: OptionalDieValue;
	selectDie: (dieValue: OptionalDieValue) => void;
}

export function DieInput({ dieValue, selectDie }: DieInputProps): JSX.Element {
	const options: Array<DieValue> = [1, 2, 3, 4, 5, 6];

	const onChange = (clickedDieValue: DieValue) => () => {
		if (clickedDieValue === dieValue) {
			selectDie(null);
		} else {
			selectDie(clickedDieValue);
		}
	};

	return (
		<SimpleGrid columns={6} spacingX={2} mx={2}>
			{options.map((value) => {
				return (
					<DieFace
						key={value.toString()}
						dieValue={value}
						isChecked={value === dieValue}
						onChange={onChange(value)}
					/>
				);
			})}
		</SimpleGrid>
	);
}
