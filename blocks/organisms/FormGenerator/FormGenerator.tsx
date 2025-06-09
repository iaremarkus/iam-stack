"use client";

import "@mdxeditor/editor/style.css";

import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { DataRecords, TFormCols } from "@/types";
import { coerceValues } from "@/utils/coerceValues";
import { getFieldsFromSchema } from "@/utils/getFieldsFromSchema";
import { toastyErrors } from "@/utils/toasty";

import styles from "./FormGenerator.module.css";
import { renderField } from "./renderField";

interface FormGeneratorProps<T extends z.ZodType> {
  children?: React.ReactNode;
  modelName: string;
  schema: T;
  defaultValues?: z.infer<T> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any;
  redirectTo?: string;
  className?: string;
  cols?: TFormCols;
  dataRecords?: DataRecords;
  debug?: boolean;
  buttons?: React.ReactNode;
  callback?: (data: T) => void;
}

export function FormGenerator<T extends z.ZodType>({
  children,
  modelName,
  schema,
  action,
  defaultValues = {},
  redirectTo = "/",
  cols = 4,
  className = "",
  callback,
  buttons = null,
  dataRecords,
  debug = false,
}: FormGeneratorProps<T>) {
  const { isPending, execute, error, isError } = action;
  const router = useRouter();

  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: coerceValues(defaultValues, schema) || undefined,
  });

  const fields = getFieldsFromSchema(schema);

  const handleSubmit = async (formData: z.infer<T>) => {
    const [data, err] = await execute(formData);

    if (err) {
      toastyErrors(err);
      console.error("Form submission error:", err);
      return;
    }

    if (data && !err) {
      toast.success("Success", {
        description: `${modelName} was successfully ${defaultValues?.id ? "updated" : "added"}`,
      });

      if (callback) callback(data);

      if (redirectTo) {
        router.push(redirectTo);
      }
    }
  };

  return (
    <Form {...form}>
      <div className={classNames("w-full flex flex-col ~gap-4/8", className)}>
        {children && (
          <div className="w-full flex flex-col ~gap-4/8">
            <div>{children}</div>
            <Separator />
          </div>
        )}

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={classNames(
            "w-full @container",
            "grid ~gap-4/8",
            className
          )}
        >
          <div
            className={classNames(
              styles.formgen,
              "w-full grid ~gap-4/8 grid-cols-1",
              cols === 2 && "grid-cols-1 @xl:grid-cols-2",
              cols === 3 && "grid-cols-1 @xl:grid-cols-3",
              cols === 4 && "grid-cols-1 @xl:grid-cols-4"
            )}
          >
            {Object.entries(fields).map(([name, field]) =>
              renderField(name, field, form, isPending, dataRecords)
            )}
          </div>

          <Separator />

          <div className="flex justify-end gap-2">
            {/* <Button variant="outline" asChild className="~text-sm/4xl">
              <Link href={redirectTo}>Cancel</Link>
            </Button> */}

            {buttons}

            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Submitting..."
                : defaultValues?.id
                  ? `Update ${modelName}`
                  : `Add ${modelName}`}
            </Button>
          </div>

          {isError && error.code === "INPUT_PARSE_ERROR" && (
            <div>{error.fieldErrors.number}</div>
          )}

          {debug && (
            <div className="w-full mt-10 flex flex-col gap-5">
              <Separator />
              <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
            </div>
          )}
        </form>
      </div>
    </Form>
  );
}
