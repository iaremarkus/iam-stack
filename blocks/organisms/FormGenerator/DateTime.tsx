import classNames from "classnames";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FieldMetadata } from "@/types";
import { formattedTime } from "@/utils/formattedDate";

export interface DateTimeProps {
  form: UseFormReturn;
  formField: ControllerRenderProps;
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
export function DateTime({
  form,
  formField,
  field,
  isPending = false,
}: DateTimeProps) {
  const { disabled } = field;

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string
  ) => {
    const currentDate = formField.value || new Date();
    const newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    return form.setValue(formField.name, newDate);
  };

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={classNames(
            "w-full pl-3 text-left font-normal",
            !formField.value && "text-muted-foreground"
          )}
          disabled={disabled || isPending}
        >
          {formField.value ? (
            <>
              <span>{format(formField.value, "PPP")}</span>
              <span className="opacity-70">
                {formattedTime(formField.value)}
              </span>
            </>
          ) : (
            <span>PPP HH:mm</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={formField.value}
            onSelect={(e) => formField.onChange(e)}
            initialFocus
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 24 }, (_, i) => i + 1)
                  .reverse()
                  .map((hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={
                        formField.value &&
                        formField.value.getHours() % 12 === hour % 12
                          ? "default"
                          : "ghost"
                      }
                      className="sm:w-full shrink-0 aspect-square pointer-events-auto"
                      onClick={() => handleTimeChange("hour", hour.toString())}
                    >
                      {hour}
                    </Button>
                  ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      formField.value && formField.value.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
