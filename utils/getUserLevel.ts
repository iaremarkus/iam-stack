import { User, UserRole } from "@prisma/client";

const roleHierarchy: Record<UserRole, number> = {
  SUPER: 100,
  ADMIN: 90,
};

export const getUserLevel = (user: User): number => {
  return roleHierarchy[user.role];
};

export const hasMinimumUserLevel = (
  user: User,
  requiredLevel: number
): boolean => {
  return getUserLevel(user) >= requiredLevel;
};

/**
 * Return the roles that a user has access to - IE the roles below my own.
 *
 * @param user User object
 * @returns
 */
export const getAllowedRoles = (user: User | null): UserRole[] => {
  if (!user) return [];

  const userLevel = roleHierarchy[user.role];
  return Object.entries(roleHierarchy)
    .filter(([_, level]) => level <= userLevel)
    .map(([role]) => role as UserRole);
};

export const getAllowedRolesToCreate = (user: User | null): UserRole[] => {
  if (!user) return [];

  const userLevel = roleHierarchy[user.role];
  return Object.entries(roleHierarchy)
    .filter(([_, level]) => level < userLevel) // Note the < instead of <= to exclude current level
    .map(([role]) => role as UserRole);
};

// Helper to check if a user can create a specific role
export const canCreateRole = (
  user: User | null,
  roleToCreate: UserRole
): boolean => {
  if (!user) return false;

  return roleHierarchy[user.role] > roleHierarchy[roleToCreate];
};
