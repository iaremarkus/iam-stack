import classNames from "classnames";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldMetadata } from "@/types";

export interface EnumSelectProps {
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
export function EnumSelect({
  form,
  formField,
  field,
  isPending = false,
  enumOptions,
}: EnumSelectProps) {
  const { disabled, placeholder, meta } = field;

  if (enumOptions.length <= 4)
    return (
      <div>
        {enumOptions.map((option, idx) => (
          <Button
            type="button"
            className={twMerge(
              classNames(
                "rounded-none -mx-px font-normal",
                idx === 0 && "rounded-l-md",
                idx === enumOptions.length - 1 && "rounded-r-md"
              )
            )}
            key={option}
            variant={formField.value === option ? "secondary" : "outline"}
            size="sm"
            defaultValue={meta?.default === option ? option : undefined}
            onClick={() => form.setValue(formField.name, option)}
          >
            {option}
          </Button>
        ))}
      </div>
    );

  return (
    <>
      <Select
        onValueChange={formField.onChange}
        defaultValue={formField.value}
        disabled={disabled || isPending}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {enumOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
