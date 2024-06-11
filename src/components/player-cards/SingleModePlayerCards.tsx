import { Box } from "@chakra-ui/react";
import type { JSX } from "react";
import { selectPlayerCardDetails } from "../../store/current-game/current-game-selectors.ts";
import { useAppSelector } from "../../store/store.ts";
import { PlayerCard } from "./PlayerCard.tsx";

export function SingleModePlayerCards(): JSX.Element {
	const players = useAppSelector(selectPlayerCardDetails);

	return (
		<>
			{players.map((details) => (
				<Box pb={1} key={details.player}>
					<PlayerCard details={details} />
				</Box>
			))}
		</>
	);
}
