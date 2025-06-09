/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

import { FieldMetadata } from "@/types";

function getDeepestType(field: any): any {
  // Base case - if no _def exists or field is null/undefined
  if (!field?._def) return field;

  // If there's an innerType, recurse into it
  if (field._def.innerType) {
    return getDeepestType(field._def.innerType);
  }

  // If no innerType, return the current _def
  return field._def.typeName;
}

// get deepest values array
function getDeepestValuesArray(field: any): any {
  // Base case - if no _def exists or field is null/undefined
  if (!field?._def) return field;
  // If there's an innerType, recurse into it
  if (field._def.innerType) {
    return getDeepestValuesArray(field._def.innerType);
  }
  // If no innerType, return the current _def
  return field._def.values;
}

export const getFieldsFromSchema = (
  schema: z.ZodType
): Record<string, FieldMetadata> => {
  if (schema instanceof z.ZodObject) {
    const shape = schema._def.shape();
    const fields: Record<string, FieldMetadata> = {};

    for (const [key, field] of Object.entries(shape)) {
      const description = (field as z.ZodTypeAny)._def.description || "";

      // Default field type based on Zod type
      let defaultType: FieldMetadata["type"] = "string";

      if (getDeepestType(field) === "ZodNumber") defaultType = "number";
      if (getDeepestType(field) === "ZodBoolean") defaultType = "boolean";
      if (getDeepestType(field) === "ZodDate") defaultType = "date";

      if (
        getDeepestType(field) === "ZodDate" &&
        (field as any)?._def?.meta?.includeTime === true
      )
        defaultType = "datetime";

      if (
        getDeepestType(field) === "ZodDate" &&
        (field as any)?._def?.meta?.timeOnly === true
      )
        defaultType = "time";

      if (getDeepestType(field) === "ZodEnum") defaultType = "enum";

      if ((field as any)?._def?.meta?.dataselect === true)
        defaultType = "dataselect";

      if (
        getDeepestType(field) === "ZodString" &&
        field instanceof z.ZodString
      ) {
        // Check for email validation
        const hasEmailValidation = field._def.checks.some(
          (check) => check.kind === "email"
        );
        if (hasEmailValidation) defaultType = "email";

        // Check for min/max length for potential textarea
        const hasLongText = field._def.checks.some(
          (check) => check.kind === "max" && check.value > 100
        );
        if (hasLongText || field?._def?.meta?.textarea === true)
          defaultType = "text";
      }

      if (
        getDeepestType(field) === "ZodString" &&
        // field instanceof z.ZodString &&
        (field as z.ZodString)?._def?.meta?.phone === true
      ) {
        defaultType = "tel";
      }

      if (
        getDeepestType(field) === "ZodString" &&
        // field instanceof z.ZodString &&
        (field as z.ZodString)?._def?.meta?.textarea
      ) {
        defaultType = "text";
      }

      // Get enum options if it's an enum
      let enumOptions: string[] | undefined;
      if (getDeepestType(field) === "ZodEnum") {
        enumOptions = getDeepestValuesArray(field);
      }

      let meta: Record<string, unknown> | undefined;
      if ((field as z.ZodTypeAny)._def.meta) {
        meta = (field as z.ZodAny)._def.meta;
      }

      // Merge default type with metadata
      fields[key] = {
        type: defaultType,
        label:
          meta?.label?.toString() ||
          key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
        description,
        enumOptions,
        meta,
      };
    }

    return fields;
  }

  return {};
};
