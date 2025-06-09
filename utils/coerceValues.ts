/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export function coerceValues<T extends z.ZodType>(
  values: any,
  schema: T
): z.infer<T> {
  const shape = (schema as any)._def.shape();
  const coerced: any = { ...values };

  Object.entries(shape).forEach(([key, def]: [string, any]) => {
    if (key in values) {
      if (
        def._def.typeName === "ZodNumber" &&
        typeof values[key] === "string"
      ) {
        coerced[key] = Number(values[key]);
      }
    }
  });

  return coerced;
}
