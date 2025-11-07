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
    } catch {}
    clearIsAuthenticated();
    router.push("/sign-in");
  };

  return (
    <nav>
      <ul>
        {!isAuthenticated && (
          <>
            <li className={styles.navigationItem}>
              <Link href="/sign-in" className={styles.navigationLink}>
                Sign in
              </Link>
            </li>
            <li className={styles.navigationItem}>
              <Link href="/sign-up" className={styles.navigationLink}>
                Sign up
              </Link>
            </li>
          </>
        )}

        {isAuthenticated && (
          <>
            {user && (
              <li className={styles.navigationItem}>
                <span className={styles.userEmail}>
                  {user.username || user.email}
                </span>
              </li>
            )}
            <li className={styles.navigationItem}>
              <Link href="/profile" className={styles.navigationLink}>
                Profile
              </Link>
            </li>
            <li className={styles.navigationItem}>
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
