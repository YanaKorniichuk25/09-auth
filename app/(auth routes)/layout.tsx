"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, []);

  return <section style={{ padding: "2rem 0" }}>{children}</section>;
}
