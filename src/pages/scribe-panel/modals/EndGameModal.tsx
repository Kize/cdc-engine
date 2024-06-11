import {
	Button,
	ButtonGroup,
	Center,
	Image,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	SimpleGrid,
	Table,
	TableCaption,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import type { JSX } from "react";
import { useNavigate } from "react-router-dom";
import type { Player } from "../../../../lib/player.ts";
import { getRandomImage } from "../../../components/hidden-images/images.ts";
import { selectDoubletteTeams } from "../../../components/player-cards/select-doublette-teams.ts";
import {
	selectIsDoublette,
	selectNumberOfTurns,
	selectPlayersWithSumScores,
} from "../../../store/current-game/current-game-selectors.ts";
import { resolversSlice } from "../../../store/resolvers/resolvers.slice.ts";
import { useAppDispatch, useAppSelector } from "../../../store/store.ts";

export interface PlayerWithSumScores {
	player: Player;
	score: number;
	positiveScore: number;
	negativeScore: number;
}

interface TeamWithSumScores {
	firstPlayer: PlayerWithSumScores;
	secondPlayer: PlayerWithSumScores;

	score: number;
	positiveScore: number;
	negativeScore: number;
}

export function EndGameModal(): JSX.Element {
	const { active } = useAppSelector((state) => state.resolvers.endGame);
	const isDoublette = useAppSelector(selectIsDoublette);
	const turnNumber = useAppSelector(selectNumberOfTurns);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const onClose = () => {
		dispatch(resolversSlice.actions.setEndGame({ active: false }));
		navigate("/");
	};

	const onAddOperations = () => {
		dispatch(resolversSlice.actions.setAddOperations({ active: true }));
	};

	return (
		<Modal
			closeOnOverlayClick={false}
			isOpen={active}
			size="4xl"
			onClose={onClose}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalCloseButton />
				<ModalHeader>La partie est terminée !</ModalHeader>

				<ModalBody>
					<SimpleGrid columns={[1, 2]} spacingX={8} spacingY={4}>
						{isDoublette ? (
							<ScoresTableInDoubletteMode turnNumber={turnNumber} />
						) : (
							<ScoresTableInSoloMode turnNumber={turnNumber} />
						)}

						<Center>
							<Image src={getRandomImage()} />
						</Center>
					</SimpleGrid>
				</ModalBody>

				<ModalFooter>
					<ButtonGroup>
						<Button colorScheme="green" onClick={onAddOperations}>
							Ajouter des opérations
						</Button>

						<Button colorScheme="blue" onClick={onClose}>
							Terminer
						</Button>
					</ButtonGroup>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

function PlayerScoreLine(props: { details: PlayerWithSumScores }) {
	return (
		<Tr>
			<Td>{props.details.player}</Td>
			<Td textAlign="right" pr={[6, 12]}>
				<Text as="b">{props.details.score} pts</Text>
			</Td>
			<Td>{props.details.positiveScore}</Td>
			<Td>{props.details.negativeScore}</Td>
		</Tr>
	);
}

function ScoresTableInSoloMode({
	turnNumber,
}: {
	turnNumber: number;
}): JSX.Element {
	const playerScores = useAppSelector(selectPlayersWithSumScores);

	return (
		<TableContainer>
			<Table size="sm">
				<TableCaption>La partie a duré {turnNumber} tours.</TableCaption>
				<Thead>
					<Tr>
						<Th>Joueurs</Th>
						<Th>Scores</Th>
						<Th>+</Th>
						<Th>-</Th>
					</Tr>
				</Thead>
				<Tbody>
					{playerScores.map((details) => (
						<PlayerScoreLine key={details.player} details={details} />
					))}
				</Tbody>
			</Table>
		</TableContainer>
	);
}

function ScoresTableInDoubletteMode({
	turnNumber,
}: {
	turnNumber: number;
}): JSX.Element {
	const playerScores = useAppSelector(selectPlayersWithSumScores);
	const doubletteTeams = useAppSelector(selectDoubletteTeams);

	const teamsScores = doubletteTeams
		.map<TeamWithSumScores>((team) => {
			const firstPlayer = playerScores.find(
				(p) => p.player === team.firstPlayer.player,
			);
			const secondPlayer = playerScores.find(
				(p) => p.player === team.secondPlayer.player,
			);

			if (!firstPlayer || !secondPlayer) {
				throw new Error("all plays should exist in doublette here");
			}

			return {
				score: team.score,
				firstPlayer:
					firstPlayer.score > secondPlayer.score ? firstPlayer : secondPlayer,
				secondPlayer:
					firstPlayer.score > secondPlayer.score ? secondPlayer : firstPlayer,
				positiveScore: firstPlayer.positiveScore + secondPlayer.positiveScore,
				negativeScore: firstPlayer.negativeScore + secondPlayer.negativeScore,
			};
		})
		.sort((t1, t2) => (t1.score < t2.score ? 1 : -1));

	return (
		<TableContainer>
			<Table size="sm">
				<TableCaption>La partie a duré {turnNumber} tours.</TableCaption>
				<Thead>
					<Tr>
						<Th>Joueurs</Th>
						<Th>Scores</Th>
						<Th>+</Th>
						<Th>-</Th>
					</Tr>
				</Thead>
				{teamsScores.map((team) => (
					<Tbody key={team.firstPlayer.player}>
						<Tr bgColor="blue.100">
							<Td>
								{team.firstPlayer.player} + {team.secondPlayer.player}
							</Td>
							<Td textAlign="right" pr={[6, 12]}>
								<Text as="b">{team.score} pts</Text>
							</Td>
							<Td>{team.positiveScore}</Td>
							<Td>{team.negativeScore}</Td>
						</Tr>

						<PlayerScoreLine details={team.firstPlayer} />
						<PlayerScoreLine details={team.secondPlayer} />
					</Tbody>
				))}
			</Table>
		</TableContainer>
	);
}
