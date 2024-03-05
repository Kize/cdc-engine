import { JSX } from 'react';
import {
  Box,
  Checkbox,
  CheckboxGroup,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { TiStar } from 'react-icons/ti';
import { RulesConfiguration } from '../../../lib/rule-runner/rule-runner-configuration.ts';
import { IconType } from 'react-icons/lib/cjs/iconBase';
import { Rules } from '../../../lib/rule-runner/rules/rule.ts';

const rulesByLevel: Array<{
  level: number;
  rules: Array<keyof RulesConfiguration>;
}> = [
  {
    level: 1,
    rules: [
      'isSouffletteEnabled',
      'isSiropEnabled',
      'isAttrapeOiseauEnabled',
      'isCivetEnabled',
    ],
  },
  {
    level: 2,
    rules: ['isArtichetteEnabled', 'isCivetDoubleEnabled'],
  },
  {
    level: 3,
    rules: ['isVerdierEnabled', 'isBleuRougeEnabled'],
  },
  {
    level: 5,
    rules: ['isTichetteEnabled'],
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

    newForm.forEach((ruleKey) => {
      updatedRules[ruleKey] = true;
    });

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
      case 'isAttrapeOiseauEnabled':
      case 'isCivetEnabled':
        return !rules.isSiropEnabled;
      case 'isCivetDoubleEnabled':
        return !rules.isCivetEnabled;
      case 'isTichetteEnabled':
        return true;
      default:
        return false;
    }
  };

  const ruleSectionHeadingProps = {
    size: 'md',
    mb: 3,
    borderBottom: '1px solid',
    borderColor: 'green.400',
  };

  const ruleCheckboxProps = {
    size: 'lg',
  };

  return (
    <Box>
      <CheckboxGroup value={form} onChange={onChangeRules}>
        {...rulesByLevel.map((ruleLevel) => (
          <Box mb={6}>
            <Heading as="h2" {...ruleSectionHeadingProps}>
              <HStack>
                <Text>Difficulté</Text>
                {...[...(Array(ruleLevel.level) as Array<void>)].map(() => (
                  <Icon as={TiStar as IconType} />
                ))}
              </HStack>
            </Heading>

            <SimpleGrid columns={[1, 2]} spacingY={1} pl={5}>
              {...ruleLevel.rules.map((ruleLabel) => (
                <Checkbox
                  {...ruleCheckboxProps}
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
    case 'isArtichetteEnabled':
      return Rules.ARTICHETTE;
    case 'isAttrapeOiseauEnabled':
      return Rules.ATTRAPE_OISEAU;
    case 'isSiropEnabled':
      return Rules.SIROP;
    case 'isCivetEnabled':
      return Rules.CIVET;
    case 'isCivetDoubleEnabled':
      return Rules.CIVET_DOUBLED;
    case 'isSouffletteEnabled':
      return Rules.SOUFFLETTE;
    case 'isBleuRougeEnabled':
      return Rules.BLEU_ROUGE;
    case 'isDoubleBevueEnabled':
      return Rules.DOUBLE_BEVUE;
    case 'isVerdierEnabled':
      return Rules.VERDIER;
    case 'isTichetteEnabled':
      return Rules.TICHETTE;
  }
}
