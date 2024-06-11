import { Box, Icon } from "@chakra-ui/react";
import type { JSX } from "react";
import {
	BsDice1,
	BsDice2,
	BsDice3,
	BsDice4,
	BsDice5,
	BsDice6,
} from "react-icons/bs";
import { CiSquareQuestion } from "react-icons/ci";
import "./DieFace.css";
import type { IconType } from "react-icons";
import type { OptionalDieValue } from "./dice-form.ts";

interface Props {
	dieValue: OptionalDieValue;
}

export function DieShape({ dieValue }: Props): JSX.Element {
	if (dieValue === null) {
		return <Box />;
	}

	const getDieIcon = (value: OptionalDieValue): IconType => {
		switch (value) {
			case 1:
				return BsDice1;
			case 2:
				return BsDice2;
			case 3:
				return BsDice3;
			case 4:
				return BsDice4;
			case 5:
				return BsDice5;
			case 6:
				return BsDice6;
			default:
				return CiSquareQuestion;
		}
	};

	return <Icon boxSize="100%" as={getDieIcon(dieValue)} color="blue.400" />;
}
