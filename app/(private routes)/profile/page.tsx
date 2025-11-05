"use client";
import { useAuthStore } from "@/lib/store/authStore";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <p>Loading...</p>;
  if (!isAuthenticated || !user) return <p>Unauthorized</p>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <img src={user.avatar} alt="Avatar" width={100} height={100} />
    </div>
  );
}
