"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function LogoutButton() {
  return (
    <DropdownMenuItem
      onClick={async () => signOut({ redirect: true, redirectTo: "/login" })}
    >
      <LogOut />
      Log out
    </DropdownMenuItem>
  );
}
