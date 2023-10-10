import { radioAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(radioAnatomy.keys);

const variants = {
  filled: definePartsStyle({
    container: {
      p: 1,
      m: 1,
      mt: 0,
      pl: 2,

      bg: 'gray.50',
      borderRadius: 'md',

      _checked: {
        bg: 'gray.200',

        _hover: {
          bg: 'gray.300',
        },
      },
      _hover: {
        bg: 'gray.100',
      },
    },
  }),
};

export const radioTheme = defineMultiStyleConfig({
  variants,
});
