import { JSX } from 'react';
import './CreateNewGame.css';
import {
  Checkbox,
  CheckboxGroup,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
} from '@chakra-ui/react';
import { TiStar } from 'react-icons/ti';

import { RulesConfiguration } from '../../../lib/rule-runner/rule-runner-configuration.ts';

export function RulesSelection({
  rules,
  setRules,
}: {
  rules: RulesConfiguration;
  setRules: (rules: RulesConfiguration) => void;
}): JSX.Element {
  const form = Object.entries(rules)
    .filter(([_, value]) => value)
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
    };

    form.forEach((ruleKey) => {
      updatedRules[ruleKey] = true;
    });

    setRules(updatedRules);
  };

  return (
    <>
      <CheckboxGroup value={form} onChange={onChangeRules}>
        <Heading as="h2" size="md">
          <HStack>
            <Text>Difficulté</Text>
            <Icon as={TiStar} />
          </HStack>
        </Heading>

        <Stack>
          <Checkbox value="isSouffletteEnabled">La Soufflette</Checkbox>
          <Checkbox value="isSiropEnabled">Le Sirop</Checkbox>
          <Checkbox value="isAttrapeOiseauEnabled">L'Attrape-Oiseau</Checkbox>
          <Checkbox value="isCivetEnabled">Le Civet</Checkbox>
        </Stack>

        <Heading as="h2" size="md">
          <HStack>
            <Text>Difficulté</Text>
            <Icon as={TiStar} />
            <Icon as={TiStar} />
          </HStack>
        </Heading>

        <Stack>
          <Checkbox value="isArtichetteEnabled">L'Artichette</Checkbox>
        </Stack>

        <Heading as="h2" size="md">
          <HStack>
            <Text>Difficulté</Text>
            <Icon as={TiStar} />
            <Icon as={TiStar} />
            <Icon as={TiStar} />
          </HStack>
        </Heading>

        <Stack>
          <Checkbox value="isVerdierEnabled">Le Verdier</Checkbox>
          <Checkbox value="isBleuRougeEnabled">Le Bleu-Rouge</Checkbox>
        </Stack>
      </CheckboxGroup>
    </>
  );
}
