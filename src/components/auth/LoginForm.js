"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    const result = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password
    });

    setIsLoading(false);
    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/dashboard/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm backdrop-blur"
    >
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@zamreal.co"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          required
        />
      </div>
      {error && <p className="text-sm text-rose-500">{error}</p>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Access dashboard"}
      </Button>
      <p className="text-xs text-slate-500">
        Use <span className="font-semibold">admin@zamreal.co</span> or <span className="font-semibold">manager@zamreal.co</span> with the
        demo passwords shared in README.
      </p>
    </form>
  );
}
