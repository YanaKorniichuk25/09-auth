"use client";

import { useEffect, useState } from "react";
import styles from "./ProfilePage.module.css";
import { useAuthStore } from "@/lib/store/authStore";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/users/me");
      const data = await res.json();
      setUser(data.user);
      setLoading(false);
    };
    fetchUser();
  }, [setUser]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.profile}>
      <h1>Profile</h1>
      {user ? (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </>
      ) : (
        <p>No user data</p>
      )}
    </div>
  );
}
