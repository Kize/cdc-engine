import type { CurrentGameState } from "../store/current-game/current-game.slice.ts";

export function persistGameToLocalStorage(currentGame: CurrentGameState) {
	const games = JSON.parse(
		localStorage.getItem("games") ?? "[]",
	) as Array<CurrentGameState>;

	games.push(currentGame);

	localStorage.setItem("games", JSON.stringify(games));
}
