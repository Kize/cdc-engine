import { JSX } from 'react';
import {
  Button,
  ButtonGroup,
  Center,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
} from '@chakra-ui/react';

interface Props {
  value: string | number;
  setValue: (value: string | number) => void;
}

export function ComplexInputNumber({ setValue, value }: Props): JSX.Element {
  const btnProps = {
    size: { base: 'md', xl: 'lg' },
  };

  const updateValue = (valueToAdd: number) => {
    const parsedValue = parseInt(value.toString());

    setValue(isNaN(parsedValue) ? valueToAdd : parsedValue + valueToAdd);
  };

  return (
    <SimpleGrid columns={[1, 3]} spacingY={2}>
      <Center pt={[0, 6]}>
        <ButtonGroup>
          <Button {...btnProps} onClick={() => updateValue(20)}>
            + 20
          </Button>
          <Button {...btnProps} onClick={() => updateValue(5)}>
            + 5
          </Button>
          <Button {...btnProps} onClick={() => updateValue(1)}>
            + 1
          </Button>
        </ButtonGroup>
      </Center>

      <Center>
        <FormControl maxW="6em">
          <FormLabel fontSize="xs">Montant</FormLabel>

          <Input
            type="number"
            textAlign="right"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </FormControl>
      </Center>

      <Center pt={[0, 6]}>
        <ButtonGroup>
          <Button {...btnProps} onClick={() => updateValue(-1)}>
            - 1
          </Button>
          <Button {...btnProps} onClick={() => updateValue(-5)}>
            - 5
          </Button>
          <Button {...btnProps} onClick={() => updateValue(-20)}>
            - 20
          </Button>
        </ButtonGroup>
      </Center>
    </SimpleGrid>
  );
}
