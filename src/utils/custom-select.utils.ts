import { SystemStyleObject } from '@chakra-ui/react';
import { SelectedOptionStyle } from 'chakra-react-select';

export const customSelectStyles = {
  selectedOptionStyle: <SelectedOptionStyle>'check',
  chakraStyles: {
    dropdownIndicator: (provided: SystemStyleObject) => ({
      ...provided,
      bg: 'transparent',
      px: 2,
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
