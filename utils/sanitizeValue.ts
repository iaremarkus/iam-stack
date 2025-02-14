export const sanitizeValue = (value: string) =>
  value
    ? value.replaceAll("-", " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : value;
