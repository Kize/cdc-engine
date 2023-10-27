import { JSX } from 'react';
import './CreateNewGame.css';
import {
  Box,
  Checkbox,
  CheckboxGroup,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { TiStar as untypedTiStar } from 'react-icons/ti';
import { RulesConfiguration } from '../../../lib/rule-runner/rule-runner-configuration.ts';
import { IconType } from 'react-icons/lib/cjs/iconBase';

const TiStar = untypedTiStar as IconType;

type Props = {
  rules: RulesConfiguration;
  setRules: (rules: RulesConfiguration) => void;
};

export function RulesSelectionPanel({ rules, setRules }: Props): JSX.Element {
  const form = Object.entries(rules)
    .filter(([, value]) => value)
    .map(([key]) => key);

  const onChangeRules = (form: Array<keyof RulesConfiguration>): void => {
    const updatedRules: RulesConfiguration = {
      isSouffletteEnabled: false,
      isSiropEnabled: false,
      isAttrapeOiseauEnabled: false,
      isCivetEnabled: false,
      isArtichetteEnabled: false,
      isVerdierEnabled: false,
      isBleuRougeEnabled: false,
      isDoubleBevueEnabled: false,
    };

    form.forEach((ruleKey) => {
      updatedRules[ruleKey] = true;
    });

    setRules(updatedRules);
  };

  const ruleSectionHeadingProps = {
    size: 'md',
    mb: 2,
  };

  const ruleStackProps = {
    spacing: 1,
  };

  const ruleCheckboxProps = {
    size: 'lg',
  };

  return (
    <Box pl={[3, 10]}>
      <CheckboxGroup value={form} onChange={onChangeRules}>
        <SimpleGrid columns={[1, 1, 2]} spacingY={4}>
          <Box>
            <Heading as="h2" {...ruleSectionHeadingProps}>
              <HStack>
                <Text>Difficulté</Text>
                <Icon as={TiStar} />
              </HStack>
            </Heading>

            <Stack {...ruleStackProps}>
              <Checkbox {...ruleCheckboxProps} value="isSouffletteEnabled">
                La Soufflette
              </Checkbox>
              <Checkbox {...ruleCheckboxProps} value="isSiropEnabled">
                Le Sirop
              </Checkbox>
              <Checkbox {...ruleCheckboxProps} value="isAttrapeOiseauEnabled">
                L'Attrape-Oiseau
              </Checkbox>
              <Checkbox {...ruleCheckboxProps} value="isCivetEnabled">
                Le Civet
              </Checkbox>
            </Stack>
          </Box>

          <Box>
            <Heading as="h2" {...ruleSectionHeadingProps}>
              <HStack>
                <Text>Difficulté</Text>
                <Icon as={TiStar} />
                <Icon as={TiStar} />
              </HStack>
            </Heading>

            <Stack {...ruleStackProps}>
              <Checkbox {...ruleCheckboxProps} value="isArtichetteEnabled">
                L'Artichette
              </Checkbox>
            </Stack>
          </Box>

          <Box>
            <Heading as="h2" {...ruleSectionHeadingProps}>
              <HStack>
                <Text>Difficulté</Text>
                <Icon as={TiStar} />
                <Icon as={TiStar} />
                <Icon as={TiStar} />
              </HStack>
            </Heading>

            <Stack {...ruleStackProps}>
              <Checkbox {...ruleCheckboxProps} value="isVerdierEnabled">
                Le Verdier
              </Checkbox>
              <Checkbox {...ruleCheckboxProps} value="isBleuRougeEnabled">
                Le Bleu-Rouge
              </Checkbox>
            </Stack>
          </Box>

          <Box>
            <Heading as="h2" {...ruleSectionHeadingProps}>
              <HStack>
                <Text>Options</Text>
              </HStack>
            </Heading>

            <Stack {...ruleStackProps}>
              <Checkbox {...ruleCheckboxProps} value="isDoubleBevueEnabled">
                Bévue doublée
              </Checkbox>
            </Stack>
          </Box>
        </SimpleGrid>
      </CheckboxGroup>
    </Box>
  );
}
