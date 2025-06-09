import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import Phone from "react-phone-number-input/react-hook-form-input";

import { Input } from "@/components/ui/input";
import { FieldMetadata } from "@/types";

export interface PhoneInputProps {
  form: UseFormReturn;
  formField: ControllerRenderProps;
  enumOptions: string[];
  isPending?: boolean;
  field: FieldMetadata;
}

/**
 * If there are more than 3 options, render a dropdown menu
 * If there are less than 3 options, render buttons
 *
 * @param formField the react-hook-form field
 * @param field the zod field
 * @param isPending is the form pending
 * @param enumOptions the enum options
 * @returns
 */
export function PhoneInput({ field, form, formField }: PhoneInputProps) {
  const { defaultValue } = field;

  return (
    <Phone
      name={formField.name}
      defaultCountry="ZA"
      defaultValue={formField.value || defaultValue}
      inputComponent={Input}
      control={form.control}
      rules={{ required: true }}
    />
  );
}
