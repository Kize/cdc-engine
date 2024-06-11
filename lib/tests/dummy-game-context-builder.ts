import {
	GameContextEvent,
	GameContextWrapper,
} from "../rule-runner/game-context-event";
import { RuleRunner } from "../rule-runner/rule-runner";
import { NeantRule } from "../rule-runner/rules/basic-rules/neant-rule";
import type { DiceRoll, DieValue } from "../rule-runner/rules/dice-rule";

export const DummyContextBuilder = {
	aDiceRollContext(): DummyDiceRollContextBuilder {
		return new DummyDiceRollContextBuilder();
	},

	aGrelottineContext(): DummyGrelottineContextBuilder {
		return new DummyGrelottineContextBuilder();
	},

	aBevueContext(): DummyBevueContextBuilder {
		return new DummyBevueContextBuilder();
	},

	aCivetContext(): DummyCivetContextBuilder {
		return new DummyCivetContextBuilder();
	},

	aVerdierContext(): DummyVerdierContextBuilder {
		return new DummyVerdierContextBuilder();
	},
};

class DummyDiceRollContextBuilder {
	private player = "";
	private diceRoll: DiceRoll = [1, 1, 1];
	private ruleRunner: RuleRunner = new RuleRunner([new NeantRule()]);

	withPlayer(player: string): this {
		this.player = player;
		return this;
	}

	withDiceRoll(diceRoll: DiceRoll): this {
		this.diceRoll = diceRoll;
		return this;
	}

	withRuleRunner(ruleRunner: RuleRunner): this {
		this.ruleRunner = ruleRunner;
		return this;
	}

	build(): GameContextWrapper {
		return new GameContextWrapper({
			event: GameContextEvent.DICE_ROLL,
			player: this.player,
			diceRoll: this.diceRoll,
			runner: this.ruleRunner,
		});
	}
}

class DummyGrelottineContextBuilder {
	private ruleRunner: RuleRunner = new RuleRunner([new NeantRule()]);

	withRuleRunner(ruleRunner: RuleRunner): this {
		this.ruleRunner = ruleRunner;
		return this;
	}

	build(): GameContextWrapper {
		return new GameContextWrapper({
			event: GameContextEvent.CHALLENGE_GRELOTTINE,
			runner: this.ruleRunner,
		});
	}
}

class DummyBevueContextBuilder {
	private playerWhoMadeABevue = "Aplayer";

	withPlayerWhoMadeABevue(playerWhoMadeABevue: string): this {
		this.playerWhoMadeABevue = playerWhoMadeABevue;
		return this;
	}

	build(): GameContextWrapper {
		return new GameContextWrapper({
			event: GameContextEvent.APPLY_BEVUE,
			playerWhoMadeABevue: this.playerWhoMadeABevue,
		});
	}
}

class DummyCivetContextBuilder {
	private player = "";
	private ruleRunner: RuleRunner = new RuleRunner([new NeantRule()]);

	withplayer(player: string): this {
		this.player = player;
		return this;
	}

	withRuleRunner(ruleRunner: RuleRunner): this {
		this.ruleRunner = ruleRunner;
		return this;
	}

	build(): GameContextWrapper {
		return new GameContextWrapper({
			event: GameContextEvent.CIVET_BET,
			runner: this.ruleRunner,
			player: this.player,
		});
	}
}

class DummyVerdierContextBuilder {
	private player = "";
	private ruleRunner: RuleRunner = new RuleRunner([new NeantRule()]);
	private diceValues: [DieValue, DieValue] = [1, 1];

	withplayer(player: string): this {
		this.player = player;
		return this;
	}

	withRuleRunner(ruleRunner: RuleRunner): this {
		this.ruleRunner = ruleRunner;
		return this;
	}

	withDiceValues(diceValues: [DieValue, DieValue]): this {
		this.diceValues = diceValues;
		return this;
	}

	build(): GameContextWrapper {
		return new GameContextWrapper({
			event: GameContextEvent.VERDIER,
			player: this.player,
			runner: this.ruleRunner,
			diceValues: this.diceValues,
		});
	}
}
