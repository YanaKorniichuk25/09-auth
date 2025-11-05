"use client";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import styles from "./AuthNavigation.module.css";

export const AuthNavigation = () => {
  const { isAuthenticated, clearIsAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    clearIsAuthenticated();
    window.location.href = "/sign-in";
  };

  return (
    <nav className={styles.nav}>
      <ul className={styles.menu}>
        {!isAuthenticated ? (
          <>
            <li>
              <Link href="/sign-in">Sign in</Link>
            </li>
            <li>
              <Link href="/sign-up">Sign up</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/profile">Profile</Link>
            </li>
            <li>
              <Link href="/notes">Notes</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
