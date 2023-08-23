import { JSX } from 'react';
import './CreateNewGame.css';
import { Checkbox, Heading, HStack, Icon, Stack, Text } from '@chakra-ui/react';
import { TiStar } from 'react-icons/ti';
import { RulesConfiguration } from '../../../lib/rule-runner/rule-runner.ts';

export function RulesSelection({
  rules,
  setRules,
}: {
  rules: RulesConfiguration;
  setRules: (rules: RulesConfiguration) => void;
}): JSX.Element {
  return (
    <>
      <Heading as="h2" size="md">
        <HStack>
          <Text>Difficulté</Text>
          <Icon as={TiStar} />
        </HStack>
      </Heading>

      <Stack>
        <Checkbox isChecked={rules.isSouffletteEnabled}>La Soufflette</Checkbox>
        <Checkbox isChecked={rules.isSiropEnabled}>Le Sirop</Checkbox>
        <Checkbox isChecked={rules.isAttrapeOiseauEnabled}>
          L'Attrape-Oiseau
        </Checkbox>
        <Checkbox isChecked={rules.isCivetEnabled}>Le Civet</Checkbox>
      </Stack>

      <Heading as="h2" size="md">
        <HStack>
          <Text>Difficulté</Text>
          <Icon as={TiStar} />
          <Icon as={TiStar} />
        </HStack>
      </Heading>

      <Stack>
        <Checkbox isChecked={rules.isArtichetteEnabled}>L'Artichette</Checkbox>
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
        <Checkbox isChecked={rules.isVerdierEnabled}>Le Verdier</Checkbox>
        <Checkbox isChecked={rules.isBleuRougeEnabled}>Le Bleu-Rouge</Checkbox>
      </Stack>
    </>
  );
}
