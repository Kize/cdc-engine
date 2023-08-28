import { SystemStyleObject } from '@chakra-ui/react';

export const customSelectStyles = {
  selectedOptionStyle: 'check',
  chakraStyles: {
    dropdownIndicator: (provided: SystemStyleObject) => ({
      ...provided,
      bg: 'transparent',
      px: 2,
      cursor: 'inherit',
    }),
    indicatorSeparator: (provided: SystemStyleObject) => ({
      ...provided,
      display: 'none',
    }),
  },
};

export interface CustomSelectOption {
  value: string;
  label: string;
  isDisabled?: boolean;
}

export const sortCustomSelectOptions = (
  a: CustomSelectOption,
  b: CustomSelectOption,
) => a.value.localeCompare(b.value);
