import type { Player } from "../../player.ts";

export type RuleEffects = Array<RuleEffect>;

export interface RuleEffect {
	player: Player;
	value: number;
	event: RuleEffectEvent;
}

export enum RuleEffectEvent {
	NEANT = "Néant",
	BEVUE = "Bévue",
	CHOUETTE = "Chouette",
	VELUTE = "Velute",
	SUITE = "Suite",
	SUITE_VELUTE = "Suite Velute (1,2,3)",
	CUL_DE_CHOUETTE = "Cul de chouette",
	CUL_DE_CHOUETTE_STOLEN = "Cul de chouette volé",
	CHOUETTE_VELUTE_WON = "Chouette velute gagnée",
	CHOUETTE_VELUTE_LOST = "Chouette velute perdue",
	CHOUETTE_VELUTE_STOLEN = "Chouette velute volée",

	ARTICHETTE = "Artichette",

	SOUFFLETTE_NO_CHALLENGE = "Soufflette sans défi",
	SOUFFLETTE_WON = "Soufflette gagnée",
	SOUFFLETTE_LOST = "Soufflette perdue",

	SIROP_LOST = "Sirotage perdu",
	SIROP_WON = "Sirotage gagné",
	SIROP_STOLEN = "Sirotage volé",
	ATTRAPE_OISEAU_WON = "Sirotage d'Attrape-oiseau gagné",
	ATTRAPE_OISEAU_LOST = "Sirotage d'Attrape-oiseau perdu",
	ATTRAPE_OISEAU_STOLEN = "Sirotage d'Attrape-oiseau volé",
	SIROP_BET_LOST = "Pari de Sirotage perdu",
	SIROP_BET_WON = "Pari de Sirotage gagné",
	SIROP_BET_SKIPPED = "Aucun pari sur le Sirotage",
	SIROP_BET_WON_BUT_NOT_CLAIMED = "Pari de Sirotage gagné mais pas clamé",

	ADD_CIVET = "Ajout d'un civet",
	REMOVE_CIVET = "Retrait du civet",
	CIVET_WON = "Défi de civet réussi",
	CIVET_LOST = "Défi de civet perdu",

	ADD_GRELOTTINE = "Ajout d'une Grelottine",
	REMOVE_GRELOTTINE = "Retrait de la Grelottine",
	GRELOTTINE_CHALLENGE_WON = "Défi de grelottine gagné",
	GRELOTTINE_CHALLENGE_LOST = "Défi de grelottine perdu",

	VERDIER_WON = "Pari du Verdier gagné",
	VERDIER_LOST = "Pari du Verdier perdu",

	BLEU_ROUGE = "Bleu-rouge",
	BLEU_ROUGE_BET_WON = "Annonce de Bleu-rouge gagnée",
	ADD_JARRET = "Ajout d'un Jarret",
	REMOVE_JARRET = "Retrait du Jarret",

	TICHETTE_WON = "Gain d'une Tichette",
	TICHETTE_LOST = "Perte d'une Tichette",
}

export enum NotImplementedRuleEffectEvent {
	POULETTE = "La poulette",
	GRAINES = "Graines",
	CONTRE_SIROP = "Contre-sirop",
	SIROP_JEANNOT = "Sirop-Jeannot",
	PASSE_GRELOT = "Passe-grelot",
	RIGODON = "Rigodon",
	CUL_DE_CHOUETTE_DOUBLE = "Cul de chouette doublé",
	PELICAN = "Pélican",
	ACHAT = "Achat",
	DOUBLE_ACHAT = "Double Achat",
	JARRET = "Jarret",
	FLAN = "Flan",
}
