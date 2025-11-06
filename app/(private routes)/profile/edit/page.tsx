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
      } catch (err) {
        console.error(err);
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
    if (!user) return;
    setError(null);
    setSaving(true);
    try {
      const data = await updateMe({ username });
      if (data) setGlobalUser(data);
      router.push("/profile");
    } catch (err) {
      setError((err as Error).message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <div className={css.avatarWrapper}>
          {user.avatar && (
            <Image
              src={user.avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          )}
        </div>

        <div className={css.formCard}>
          <h1>Edit profile</h1>
          <form onSubmit={handleSave} className={css.form}>
            <div className={css.row}>
              <label>Email</label>
              <input value={user.email} readOnly />
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
      </div>
    </main>
  );
}
