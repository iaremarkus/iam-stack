import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    enabled: false,
  });
}
