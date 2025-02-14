export const sanitizeCase = (role: string) =>
  role?.split("").length < 4
    ? role.toUpperCase()
    : role
        ?.split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ") || "";
