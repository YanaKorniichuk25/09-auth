"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/types/user";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    user,
    isAuthenticated,
    setUser,
    clearIsAuthenticated,
    isLoading,
    setIsLoading,
  } = useAuthStore();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);

        // 🟢 Якщо користувач уже є в сторі — не перевіряємо повторно
        if (isAuthenticated && user) {
          setIsLoading(false);
          return;
        }

        const res = await fetch("/api/auth/session", {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.success) {
          // якщо бекенд не повертає користувача — створюємо заглушку
          const validUser: User = data.user || {
            username: "User",
            email: "placeholder@example.com",
            avatar: "/default-avatar.png",
          };

          setUser(validUser);
        } else {
          clearIsAuthenticated();

          if (
            pathname.startsWith("/profile") ||
            pathname.startsWith("/notes")
          ) {
            router.push("/sign-in");
          }
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [
    pathname,
    router,
    isAuthenticated,
    user,
    setUser,
    clearIsAuthenticated,
    setIsLoading,
  ]);

  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
};
