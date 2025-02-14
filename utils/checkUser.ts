import { redirect } from "next/navigation";

import { getUser } from "./getUser";

export const checkUser = async () => {
  const user = await getUser();
  if (!user) redirect("/login");

  return user;
};
