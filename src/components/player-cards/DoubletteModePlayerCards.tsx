import { Button, Center, Flex, Text, VStack } from "@chakra-ui/react";
import type { JSX } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { applyBevueThunk } from "../../store/current-game/current-game-actions-thunks.ts";
import { useAppDispatch, useAppSelector } from "../../store/store.ts";
import { PlayerStatuses } from "./PlayerStatuses.tsx";
import type { PlayerCardDetails } from "./player-card-details.ts";
import { selectDoubletteTeams } from "./select-doublette-teams.ts";

export function DoubletteModePlayerCards(): JSX.Element {
	const dispatch = useAppDispatch();
	const teams = useAppSelector(selectDoubletteTeams);

	const clickBevue =
		(firstPlayer: PlayerCardDetails, secondPlayer: PlayerCardDetails) => () =>
			dispatch(
				applyBevueThunk(
					Math.random() < 0.5 ? firstPlayer.player : secondPlayer.player,
				),
			);

	return (
		<>
			{teams.map(({ firstPlayer, secondPlayer, score }) => (
				<Flex key={firstPlayer.player} mb={3} bgColor="blue.50">
					<SoloCard details={firstPlayer} />

					<Center>
						<VStack mx={4}>
							<Text>{score} points</Text>

							<Button
								aria-label="Bévue"
								colorScheme="red"
								variant="outline"
								size="sm"
								leftIcon={<AiOutlineExclamationCircle />}
								onClick={clickBevue(firstPlayer, secondPlayer)}
							>
								bévue
							</Button>
						</VStack>
					</Center>

					<SoloCard details={secondPlayer} />
				</Flex>
			))}
		</>
	);
}

function SoloCard(props: { details: PlayerCardDetails }): JSX.Element {
	return (
		<VStack
			flex={1}
			bgColor={props.details.isCurrentPlayer ? "blue.100" : "blue.50"}
			borderRadius={6}
			py={2}
		>
			<Text as="b">{props.details.player}</Text>

			<PlayerStatuses details={props.details} />
		</VStack>
	);
}
