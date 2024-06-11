import {
	Box,
	Checkbox,
	CheckboxGroup,
	HStack,
	Heading,
	Icon,
	SimpleGrid,
	Text,
} from "@chakra-ui/react";
import type { JSX } from "react";
import { TiStar } from "react-icons/ti";
import type { RulesConfiguration } from "../../../lib/rule-runner/rule-runner-configuration.ts";
import { Rules } from "../../../lib/rule-runner/rules/rule.ts";

const rulesByLevel: Array<{
	level: number;
	rules: Array<keyof RulesConfiguration>;
}> = [
	{
		level: 1,
		rules: [
			"isSouffletteEnabled",
			"isSiropEnabled",
			"isAttrapeOiseauEnabled",
			"isCivetEnabled",
		],
	},
	{
		level: 2,
		rules: ["isArtichetteEnabled", "isCivetDoubleEnabled"],
	},
	{
		level: 3,
		rules: ["isVerdierEnabled", "isBleuRougeEnabled"],
	},
	{
		level: 5,
		rules: ["isTichetteEnabled"],
	},
];

type Props = {
	rules: RulesConfiguration;
	setRules: (rules: RulesConfiguration) => void;
};

export function RulesSelectionPanel({ rules, setRules }: Props): JSX.Element {
	const form = Object.entries(rules)
		.filter(([, value]) => value)
		.map(([key]) => key);

	const onChangeRules = (newForm: Array<keyof RulesConfiguration>): void => {
		const updatedRules: RulesConfiguration = {
			isSouffletteEnabled: false,
			isSiropEnabled: false,
			isAttrapeOiseauEnabled: false,
			isCivetEnabled: false,
			isCivetDoubleEnabled: false,
			isArtichetteEnabled: false,
			isVerdierEnabled: false,
			isBleuRougeEnabled: false,
			isDoubleBevueEnabled: false,
			isTichetteEnabled: false,
		};

		for (const ruleKey of newForm) {
			updatedRules[ruleKey] = true;
		}

		if (updatedRules.isCivetEnabled && !updatedRules.isSiropEnabled) {
			updatedRules.isCivetEnabled = false;
		}

		if (updatedRules.isAttrapeOiseauEnabled && !updatedRules.isSiropEnabled) {
			updatedRules.isAttrapeOiseauEnabled = false;
		}

		if (updatedRules.isCivetDoubleEnabled && !updatedRules.isCivetEnabled) {
			updatedRules.isCivetDoubleEnabled = false;
		}

		setRules(updatedRules);
	};

	const isRuleCheckboxDisabled = (
		ruleLabel: keyof RulesConfiguration,
	): boolean => {
		switch (ruleLabel) {
			case "isAttrapeOiseauEnabled":
			case "isCivetEnabled":
				return !rules.isSiropEnabled;
			case "isCivetDoubleEnabled":
				return !rules.isCivetEnabled;
			default:
				return false;
		}
	};

	const ruleSectionHeadingProps = {
		size: "md",
		mb: 3,
		borderBottom: "1px solid",
		borderColor: "green.400",
	};

	const ruleCheckboxProps = {
		size: "lg",
	};

	return (
		<Box>
			<CheckboxGroup value={form} onChange={onChangeRules}>
				{...rulesByLevel.map((ruleLevel) => (
					<Box mb={6} key={ruleLevel.level}>
						<Heading as="h2" {...ruleSectionHeadingProps}>
							<HStack>
								<Text>Difficulté</Text>
								{...[...Array(ruleLevel.level)].map((_, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: No data provided, only the index ensures uniqueness here
									<Icon as={TiStar} key={index} />
								))}
							</HStack>
						</Heading>

						<SimpleGrid columns={[1, 2]} spacingY={1} pl={5}>
							{...ruleLevel.rules.map((ruleLabel) => (
								<Checkbox
									{...ruleCheckboxProps}
									key={ruleLabel}
									value={ruleLabel}
									isDisabled={isRuleCheckboxDisabled(ruleLabel)}
								>
									{translateRuleLabel(ruleLabel)}
								</Checkbox>
							))}
						</SimpleGrid>
					</Box>
				))}

				<Box>
					<Heading as="h2" {...ruleSectionHeadingProps}>
						<HStack>
							<Text>Options</Text>
						</HStack>
					</Heading>

					<SimpleGrid columns={[1, 2]} spacingY={1} pl={5}>
						<Checkbox {...ruleCheckboxProps} value="isDoubleBevueEnabled">
							Bévue doublée
						</Checkbox>
					</SimpleGrid>
				</Box>
			</CheckboxGroup>
		</Box>
	);
}

function translateRuleLabel(ruleLabel: keyof RulesConfiguration): Rules {
	switch (ruleLabel) {
		case "isArtichetteEnabled":
			return Rules.ARTICHETTE;
		case "isAttrapeOiseauEnabled":
			return Rules.ATTRAPE_OISEAU;
		case "isSiropEnabled":
			return Rules.SIROP;
		case "isCivetEnabled":
			return Rules.CIVET;
		case "isCivetDoubleEnabled":
			return Rules.CIVET_DOUBLED;
		case "isSouffletteEnabled":
			return Rules.SOUFFLETTE;
		case "isBleuRougeEnabled":
			return Rules.BLEU_ROUGE;
		case "isDoubleBevueEnabled":
			return Rules.DOUBLE_BEVUE;
		case "isVerdierEnabled":
			return Rules.VERDIER;
		case "isTichetteEnabled":
			return Rules.TICHETTE;
	}
}
