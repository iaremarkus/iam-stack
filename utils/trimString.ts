export const trimString = (str: string | null, length: number = 50): string => {
  if (!str) return "";

  if (str.length <= length) return str;

  return str.substring(0, length) + "...";
};
