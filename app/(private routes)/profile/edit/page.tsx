"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import css from "./EditProfilePage.module.css";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { User } from "@/types/user";
import { useAuthStore } from "@/lib/store/authStore";

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUserLocal] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser: setGlobalUser } = useAuthStore();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await getMe();
        if (!mounted) return;
        setUserLocal(u);
        setUsername(u?.username ?? "");
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCancel = () => {
    router.push("/profile");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const data = await updateMe({ username });
      if (data) setGlobalUser(data as any); // update global store for consistency
      setSaving(false);
      router.push("/profile");
    } catch (err) {
      setSaving(false);
      setError((err as Error).message || "Failed to update profile");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.formCard}>
        <h1>Edit profile</h1>
        <form onSubmit={handleSave} className={css.form}>
          <div className={css.row}>
            <label>Email</label>
            <input value={user?.email ?? ""} readOnly />
          </div>

          <div className={css.row}>
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={css.actions}>
            <button type="submit" disabled={saving}>
              Save
            </button>
            <button type="button" onClick={handleCancel} disabled={saving}>
              Cancel
            </button>
          </div>

          {error && <p className={css.error}>{error}</p>}
        </form>
      </div>
    </main>
  );
}
