"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type State = "idle" | "loading" | "error";

export function LoginForm() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [state, setState]       = useState<State>("idle");
  const [error, setError]       = useState<string | null>(null);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setState("loading");
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError("E-mail ou senha incorretos.");
      setState("error");
      return;
    }

    router.push("/hoje");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={state === "loading"}
          className="bg-bg-subtle border-border text-text-primary placeholder:text-text-muted focus-visible:ring-border-focus"
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={state === "loading"}
          className="bg-bg-subtle border-border text-text-primary placeholder:text-text-muted focus-visible:ring-border-focus"
        />
        {error && (
          <p role="alert" className="text-xs text-danger">{error}</p>
        )}
      </div>
      <Button
        type="submit"
        disabled={state === "loading" || !email.trim() || !password}
        className="w-full bg-accent-brand text-bg-base hover:bg-accent-brand-hover"
      >
        {state === "loading" ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
