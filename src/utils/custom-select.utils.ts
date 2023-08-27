export interface CustomSelectOption {
  value: string;
  label: string;
  isDisabled?: boolean;
}

export const sortCustomSelectOptions = (
  a: CustomSelectOption,
  b: CustomSelectOption,
) => a.value.localeCompare(b.value);
