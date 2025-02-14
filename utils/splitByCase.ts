/**
 * Eg: Change goodStanding to Good Standing
 * @param str
 */
export const splitByCase = (str: string): string => {
  return str.replace(/([A-Z])/g, " $1");
};
