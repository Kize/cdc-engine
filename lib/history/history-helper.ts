import type { Player } from "../player";
import { RuleEffectEvent } from "../rule-runner/rules/rule-effect.ts";
import { GameLineType, type HistoryLine } from "./history-line";

export interface GameEvent {
	id: string;
	historyLines: Array<HistoryLine>;
}

export class HistoryHelper {
	getPlayerScore(events: Array<GameEvent>, player: Player): number {
		return this.getPlayerScoreFromEvents(events, player);
	}

	//TODO: rewrite this to history view
	getPlayerScoreAtEvent(
		events: Array<GameEvent>,
		player: Player,
		eventId: string,
	): number {
		const index = events.findIndex((event) => event.id === eventId);

		return this.getPlayerScoreFromEvents(events.slice(0, index + 1), player);
	}

	getPlayerPositiveSumScore(events: Array<GameEvent>, player: Player): number {
		return events.reduce(
			(eventSum, event) =>
				eventSum +
				event.historyLines.reduce(
					(lineSum, line) =>
						line.player === player && line.amount > 0
							? lineSum + line.amount
							: lineSum,
					0,
				),
			0,
		);
	}

	getPlayerNegativeSumScore(events: Array<GameEvent>, player: Player): number {
		return events.reduce(
			(eventSum, event) =>
				eventSum +
				event.historyLines.reduce(
					(lineSum, line) =>
						line.player === player && line.amount < 0
							? lineSum + line.amount
							: lineSum,
					0,
				),
			0,
		);
	}

	hasGrelottine(events: Array<GameEvent>, player: Player): boolean {
		const playerHistory = this.getPlayerHistory(player, events);

		return playerHistory.reduce((has: boolean, historyLine: HistoryLine) => {
			if (historyLine.designation === RuleEffectEvent.ADD_GRELOTTINE) {
				return true;
			}

			if (historyLine.designation === RuleEffectEvent.REMOVE_GRELOTTINE) {
				return false;
			}

			return has;
		}, false);
	}

	hasCivet(events: Array<GameEvent>, player: Player): boolean {
		const playerHistory = this.getPlayerHistory(player, events);

		return playerHistory.reduce((has: boolean, historyLine: HistoryLine) => {
			if (historyLine.designation === RuleEffectEvent.ADD_CIVET) {
				return true;
			}

			if (historyLine.designation === RuleEffectEvent.REMOVE_CIVET) {
				return false;
			}

			return has;
		}, false);
	}

	getNumberOfTurnsPlayed(events: Array<GameEvent>, player: Player): number {
		return events.reduce((numberOfTurnsPlayed: number, event) => {
			const numberOfTurnsPlayedInEvent = event.historyLines.reduce(
				(sum: number, line) => {
					if (
						line.player === player &&
						line.designation === GameLineType.PLAY_TURN
					) {
						return sum + 1;
					}
					return sum;
				},
				0,
			);

			return numberOfTurnsPlayed + numberOfTurnsPlayedInEvent;
		}, 0);
	}

	private getPlayerScoreFromEvents(
		events: Array<GameEvent>,
		player: Player,
	): number {
		return events.reduce((sum: number, event) => {
			const historyLinesSum = event.historyLines.reduce(
				(subSum: number, line) => {
					if (line.player === player) {
						return subSum + line.amount;
					}
					return subSum;
				},
				0,
			);

			return sum + historyLinesSum;
		}, 0);
	}

	private getPlayerHistory(
		player: Player,
		events: Array<GameEvent>,
	): Array<HistoryLine> {
		return events.reduce((lines: Array<HistoryLine>, event) => {
			const playerLines = event.historyLines.filter(
				(line) => line.player === player,
			);

			lines.push(...playerLines);

			return lines;
		}, []);
	}
}
