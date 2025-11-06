"use server";

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/serverApi";

export default async function PrivateRoutesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getMe();
  if (!user) redirect("/sign-in");
  return <>{children}</>;
}
