export const getInitials = (
  firstName: string | null,
  lastName: string | null
) => {
  if (!firstName && !lastName) return "-";

  if (firstName && !lastName) {
    return firstName[0].toUpperCase();
  }

  if (firstName && lastName) {
    return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
  }

  return "-";
};
