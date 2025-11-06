"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import styles from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const { isAuthenticated, clearIsAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore network errors
    }
    clearIsAuthenticated();
    router.push("/");
  };

  return (
    <nav className={styles.root}>
      <ul className={styles.list}>
        {!isAuthenticated && (
          <>
            <li>
              <Link href="/sign-in">Sign in</Link>
            </li>
            <li>
              <Link href="/sign-up">Sign up</Link>
            </li>
          </>
        )}

        {isAuthenticated && (
          <>
            <li className={styles.user}>
              {user ? user.username || user.email : null}
            </li>
            <li>
              <Link href="/profile">Profile</Link>
            </li>
            <li>
              <Link href="/notes">Notes</Link>
            </li>
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
