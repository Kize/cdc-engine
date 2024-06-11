import { Flex, ModalHeader, Text } from "@chakra-ui/react";
import type { JSX } from "react";
import { BevueSelectorButton } from "../bevue-selector-button/BevueSelectorButton.tsx";

interface Props {
	title: string;
	[key: string]: string | number;
}

export function BevueModalHeader({ title, ...props }: Props): JSX.Element {
	return (
		<ModalHeader {...props}>
			<Flex pr={6}>
				<Text flex={1}>{title}</Text>

				<BevueSelectorButton />
			</Flex>
		</ModalHeader>
	);
}
