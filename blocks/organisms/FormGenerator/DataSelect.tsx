import { ControllerRenderProps, UseFormReturn } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldMetadata, SelectOption } from "@/types";

export interface DataSelectProps {
  form: UseFormReturn;
  formField: ControllerRenderProps;
  options: SelectOption[];
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
 * @param options the enum options
 * @returns
 */
export function DataSelect({
  formField,
  field,
  options,
  isPending = false,
}: DataSelectProps) {
  const { disabled, placeholder } = field;

  return (
    <Select
      onValueChange={formField.onChange}
      defaultValue={formField.value}
      disabled={disabled || isPending}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
