import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { Player } from "../../../lib/player.ts";
import type { DieValue } from "../../../lib/rule-runner/rules/dice-rule.ts";
import type { PlayableBid } from "../../../lib/rule-runner/rules/level-1/sirotage-rule.types.ts";

export interface ResolversState {
	addOperations: { active: boolean };
	chanteSloubi: { active: boolean };
	endGame: { active: boolean };

	grelottine: {
		active: boolean;
	};
	culDeChouette: { active: boolean; player: Player };
	suite: { active: boolean; player: Player };
	chouetteVelute: { active: boolean; player: Player };
	soufflette: { active: boolean; player: Player };
	artichette: { active: boolean; player: Player };
	sirop: {
		active: boolean;
		player: string;
		playableBids: Array<PlayableBid>;
		chouetteValue: DieValue;
	};
	civet: { active: boolean; player: Player };
	bleuRouge: { active: boolean; player: Player };
	verdier: {
		active: boolean;
		player: Player;
		diceValues: [DieValue, DieValue];
	};
	tichette: {
		active: boolean;
		player: Player;
		canClaimRobobrol: boolean;
	};
	robobrol: {
		active: boolean;
		player: Player;
	};
}

function initialState(): ResolversState {
	return {
		chanteSloubi: { active: false },
		addOperations: { active: false },
		endGame: { active: false },
		grelottine: {
			active: false,
		},
		culDeChouette: {
			active: false,
			player: "",
		},
		suite: {
			active: false,
			player: "",
		},
		chouetteVelute: {
			active: false,
			player: "",
		},
		soufflette: {
			active: false,
			player: "",
		},
		artichette: {
			active: false,
			player: "",
		},
		sirop: {
			active: false,
			player: "",
			chouetteValue: 1,
			playableBids: [],
		},
		civet: {
			active: false,
			player: "",
		},
		bleuRouge: {
			active: false,
			player: "",
		},
		verdier: {
			active: false,
			player: "",
			diceValues: [1, 1],
		},
		tichette: {
			active: false,
			player: "",
			canClaimRobobrol: false,
		},
		robobrol: {
			active: false,
			player: "",
		},
	};
}

export const resolversSlice = createSlice({
	name: "resolvers",
	initialState,
	reducers: {
		setAddOperations: (
			state,
			{ payload }: PayloadAction<ResolversState["addOperations"]>,
		) => {
			state.addOperations = payload;
		},
		setChanteSloubi: (
			state,
			{ payload }: PayloadAction<ResolversState["chanteSloubi"]>,
		) => {
			state.chanteSloubi = payload;
		},
		setEndGame: (
			state,
			{ payload }: PayloadAction<ResolversState["endGame"]>,
		) => {
			state.endGame = payload;
		},
		setGrelottine: (
			state,
			{ payload }: PayloadAction<ResolversState["grelottine"]>,
		) => {
			state.grelottine = payload;
		},
		setCulDeChouette: (
			state,
			{ payload }: PayloadAction<ResolversState["culDeChouette"]>,
		) => {
			state.culDeChouette = { ...payload };
		},
		setSuite: (state, { payload }: PayloadAction<ResolversState["suite"]>) => {
			state.suite = { ...payload };
		},
		setChouetteVelute: (
			state,
			{ payload }: PayloadAction<ResolversState["chouetteVelute"]>,
		) => {
			state.chouetteVelute = { ...payload };
		},
		setSoufflette: (
			state,
			{ payload }: PayloadAction<ResolversState["soufflette"]>,
		) => {
			state.soufflette = { ...payload };
		},
		setArtichette: (
			state,
			{ payload }: PayloadAction<ResolversState["artichette"]>,
		) => {
			state.artichette = { ...payload };
		},
		setSirop: (state, { payload }: PayloadAction<ResolversState["sirop"]>) => {
			state.sirop = { ...payload };
		},
		setCivet: (state, { payload }: PayloadAction<ResolversState["civet"]>) => {
			state.civet = { ...payload };
		},
		setBleuRouge: (
			state,
			{ payload }: PayloadAction<ResolversState["bleuRouge"]>,
		) => {
			state.bleuRouge = { ...payload };
		},
		setVerdier: (
			state,
			{ payload }: PayloadAction<ResolversState["verdier"]>,
		) => {
			state.verdier = { ...payload };
		},
		setTichette: (
			state,
			{ payload }: PayloadAction<ResolversState["tichette"]>,
		) => {
			state.tichette = { ...payload };
		},
		setRobobrol: (
			state,
			{ payload }: PayloadAction<ResolversState["robobrol"]>,
		) => {
			state.robobrol = { ...payload };
		},
	},
});
