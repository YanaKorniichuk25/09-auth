"use client";

import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { usePathname, useRouter } from "next/navigation";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setIsLoading, isLoading, user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
          if (pathname.startsWith("/notes")) {
            router.push("/sign-in");
          }
        }
      } catch {
        setUser(null);
        if (pathname.startsWith("/notes")) {
          router.push("/sign-in");
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, [setUser, setIsLoading, pathname, router]);

  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
}
