import { format } from "date-fns";

export const formattedDate = (date: Date): string => {
  if (!date) return "";

  return format(date, "dd MMM yyyy");
};
