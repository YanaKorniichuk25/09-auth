"use client";

import { FormEvent, useState } from "react";
import { login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login({ email, password });
      setUser(user);
      router.push("/profile"); // redirect to profile after login
    } catch {
      setError("Невірний email або пароль.");
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Sign in</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 12, width: 360 }}
      >
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign in</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}
