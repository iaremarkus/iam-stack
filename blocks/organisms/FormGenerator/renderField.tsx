import "@mdxeditor/editor/style.css";

import classNames, { Argument } from "classnames";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { Suspense } from "react";
import { Path, PathValue, UseFormReturn } from "react-hook-form";
import Markdown from "react-markdown";
import slugify from "react-slugify";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { DataRecords, FieldMetadata } from "@/types";
import { UploadButton } from "@/utils/uploadthing";

import { DataSelect } from "./DataSelect";
import { DateTime } from "./DateTime";
import { EnumSelect } from "./EnumSelect";
import { PhoneInput } from "./Phone";
import { TimePickerField } from "./TimePicker";

// Add this type definition at the top of the file
type ShowCondition = {
  field: string;
  operator: "equals" | "notEquals" | "in" | "notIn";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

// Update the meta field in the zod register to include showIf
declare module "zod" {
  interface ZodMetadata {
    hidden?: boolean;
    className?: string;
    showIf?: ShowCondition | ShowCondition[];
    textarea?: boolean;
  }
}

const ClientEditor = dynamic(() => import("../Editor/Editor"), {
  ssr: false,
});

const evaluateCondition = (
  condition: ShowCondition,
  form: UseFormReturn
): boolean => {
  const fieldValue = form.watch(condition.field);

  switch (condition.operator) {
    case "equals":
      return fieldValue === condition.value;
    case "notEquals":
      return fieldValue !== condition.value;
    case "in":
      return (
        Array.isArray(condition.value) && condition.value.includes(fieldValue)
      );
    case "notIn":
      return (
        Array.isArray(condition.value) && !condition.value.includes(fieldValue)
      );
    default:
      return true;
  }
};

export const renderField = <T extends z.ZodType>(
  name: string,
  field: FieldMetadata,
  form: UseFormReturn,
  isPending: boolean,
  dataRecords?: DataRecords
) => {
  const {
    type,
    label = name,
    placeholder = field.meta?.placeholder?.toString() || `Enter ${label}...`,
    description,
    enumOptions = [],
    disabled = false,
    meta,
  } = field;

  // Handle showIf conditions
  if (meta?.showIf) {
    const conditions = Array.isArray(meta.showIf) ? meta.showIf : [meta.showIf];
    const shouldShow = conditions.every((condition) =>
      evaluateCondition(condition, form)
    );
    if (!shouldShow) return null;
  }

  if (meta?.hidden === true) return null;

  return (
    <FormField
      key={name}
      control={form.control}
      name={name as Path<z.infer<T>>}
      render={({ field: formField }) => (
        <FormItem
          className={classNames(
            type === "text" && "col-[1/-1]",
            type === "boolean" && "col-[1/-1]",
            meta?.className ?? (meta?.className as Argument)
          )}
        >
          {type !== "boolean" && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {(() => {
              switch (type) {
                case "text":
                  return meta?.markdown === true ? (
                    <Suspense fallback="Loading Editor">
                      <div className="form-editor" suppressHydrationWarning>
                        <ClientEditor
                          markdown={formField.value ?? ""}
                          {...formField}
                          onChange={(e) =>
                            form.setValue(
                              formField.name,
                              e as PathValue<string, string>,
                              {
                                shouldValidate: true,
                              }
                            )
                          }
                        />
                      </div>
                    </Suspense>
                  ) : (
                    <Textarea
                      {...formField}
                      value={formField.value ?? ""}
                      placeholder={placeholder}
                      className="min-h-32"
                      disabled={disabled || isPending}
                    />
                  );

                case "string":
                case "email":
                  return (
                    <Input
                      {...formField}
                      value={formField.value ?? ""}
                      type={type === "email" ? "email" : "text"}
                      placeholder={placeholder}
                      disabled={
                        meta?.disabled === true || disabled || isPending
                      }
                      onChange={(e) => {
                        formField.onChange(e);

                        if (meta?.slug) {
                          form.setValue("slug", slugify(e.target.value || ""));
                        }
                      }}
                    />
                  );

                case "number":
                  return (
                    <Input
                      {...formField}
                      type="number"
                      value={formField.value ?? ""}
                      onChange={(e) =>
                        formField.onChange(e.target.valueAsNumber)
                      }
                      placeholder={placeholder}
                      disabled={disabled || isPending}
                    />
                  );

                case "file":
                  return (
                    <div className="flex items-start ~gap-4/8 justify-start">
                      <UploadButton
                        endpoint="imageUploader"
                        className={classNames("upload-button")}
                        onClientUploadComplete={(res) => {
                          form.setValue(
                            formField.name,
                            res[0].ufsUrl as PathValue<string, string>
                          );
                          toast.success(
                            `File${res.length > 1 ? "s" : ""} uploaded`
                          );
                        }}
                        onUploadError={(error: Error) => {
                          // Do something with the error.
                          console.error(`ERROR! ${error.message}`);
                          toast.error("File upload failed", {
                            description: error.message,
                          });
                        }}
                      />

                      {formField.value && (
                        <Image
                          src={formField.value}
                          alt="Avatar"
                          width={80}
                          height={80}
                          className={classNames(
                            "block size-10 object-cover rounded-full overflow-hidden",
                            "border-2 border-primary"
                          )}
                        />
                      )}
                    </div>
                  );

                case "boolean":
                  return (
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formField.value}
                        onCheckedChange={formField.onChange}
                        disabled={disabled || isPending}
                      />
                      {type === "boolean" && <FormLabel>{label}</FormLabel>}
                    </div>
                  );

                case "date":
                  return (
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formField.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon />
                            {formField.value ? (
                              format(formField.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formField.value}
                            onSelect={(e) => formField.onChange(e)}
                            initialFocus
                            defaultMonth={form.getValues()?.startDate}
                            disabled={(date) =>
                              date < new Date() ||
                              date < new Date("1900-01-01") ||
                              date < form.getValues().startDate
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  );

                case "time":
                  return (
                    <TimePickerField
                      setDate={(e) => formField.onChange(e)}
                      date={formField.value}
                    />
                  );

                case "datetime":
                  return (
                    <DateTime
                      form={form}
                      formField={formField}
                      isPending={isPending}
                      field={field}
                    />
                  );

                case "tel":
                  return (
                    <PhoneInput
                      form={form}
                      formField={formField}
                      enumOptions={enumOptions}
                      isPending={isPending}
                      field={field}
                    />
                  );

                case "dataselect":
                  const options = dataRecords?.[formField.name as string] || [];
                  if (options) {
                    return (
                      <DataSelect
                        form={form}
                        formField={formField}
                        options={options}
                        isPending={isPending}
                        field={field}
                      />
                    );
                  }
                  return null;

                case "enum":
                  return (
                    <EnumSelect
                      form={form}
                      formField={formField}
                      enumOptions={enumOptions}
                      isPending={isPending}
                      field={field}
                    />
                  );

                default:
                  return (
                    <Input
                      {...formField}
                      value={formField.value ?? ""}
                      placeholder={placeholder}
                      disabled={disabled || isPending}
                    />
                  );
              }
            })()}
          </FormControl>

          {description && (
            <div
              className={classNames(
                "font-light text-muted-foreground leading-tight text-xs",
                "prose prose-a:text-muted-foreground prose-sm prose-a:hover:text-primary"
              )}
            >
              <Markdown>{description}</Markdown>
            </div>
          )}

          {meta?.markdown === true && (
            <div
              className={classNames(
                "font-light text-muted-foreground leading-tight text-xs",
                "prose prose-a:text-muted-foreground prose-sm prose-a:hover:text-primary"
              )}
            >
              <Markdown>
                [Markdown](https://www.markdownguide.org/cheat-sheet/) is
                supported.
              </Markdown>
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
