import { Box, SimpleGrid } from "@chakra-ui/react";
import { type JSX, useEffect, useState } from "react";
import { GameStatus } from "../../../lib/game/game-handler.ts";
import { GameContextEvent } from "../../../lib/rule-runner/game-context-event.ts";
import {
	type DiceForm,
	getNewDiceForm,
	isDiceFormValid,
} from "../../components/dice/dice-form.ts";
import { playATurnThunk } from "../../store/current-game/current-game-actions-thunks.ts";
import {
	selectGameStatus,
	selectNumberOfTurns,
} from "../../store/current-game/current-game-selectors.ts";
import { resolversSlice } from "../../store/resolvers/resolvers.slice.ts";
import { useAppDispatch, useAppSelector } from "../../store/store.ts";
import { PlayTurnPanel } from "./components/PlayTurnPanel.tsx";
import { PlayerDetailsSummary } from "./components/PlayerDetailsSummary.tsx";
import { ScribePanelHeader } from "./components/ScribePanelHeader.tsx";
import { ScribePanelModals } from "./components/ScribePanelModals.tsx";

export function ScribePanel(): JSX.Element {
	const numberOfTurns = useAppSelector(selectNumberOfTurns);
	const gameStatus = useAppSelector(selectGameStatus);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (gameStatus === GameStatus.FINISHED) {
			dispatch(resolversSlice.actions.setEndGame({ active: true }));
		}
	});

	const [diceForm, setDiceForm] = useState<DiceForm>(getNewDiceForm());

	const onChangeForm = (form: DiceForm): void => {
		setDiceForm(form);
		if (isDiceFormValid(form)) {
			setTimeout(async () => {
				await dispatch(
					playATurnThunk({ event: GameContextEvent.DICE_ROLL, diceRoll: form }),
				);
				setDiceForm(getNewDiceForm());
			}, 200);
		}
	};

	return (
		<>
			<ScribePanelHeader />

			<SimpleGrid
				columns={[1, 2]}
				spacingX={8}
				spacingY={4}
				p={[2, null, null, 6]}
			>
				<Box>
					<PlayerDetailsSummary />
				</Box>

				<PlayTurnPanel
					numberOfTurns={numberOfTurns}
					diceForm={diceForm}
					onChangeDiceForm={onChangeForm}
				/>
			</SimpleGrid>

			<ScribePanelModals />
		</>
	);
}
