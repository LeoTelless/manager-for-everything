"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type State = "idle" | "loading" | "sent" | "error";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setState("loading");
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
      },
    });

    if (authError) {
      setError("Não foi possível enviar o link. Tente novamente.");
      setState("error");
      return;
    }

    setState("sent");
  }

  if (state === "sent") {
    return (
      <div className="rounded-lg border border-border bg-bg-surface p-6 text-center space-y-2">
        <p className="text-sm font-medium text-text-primary">
          Link enviado para {email}
        </p>
        <p className="text-xs text-text-secondary">
          Verifique sua caixa de entrada e clique no link para entrar.
        </p>
        <button
          onClick={() => { setState("idle"); setEmail(""); }}
          className="text-xs text-accent underline underline-offset-2 mt-2"
        >
          Usar outro e-mail
        </button>
      </div>
    );
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
        {error && (
          <p className="text-xs text-danger">{error}</p>
        )}
      </div>
      <Button
        type="submit"
        disabled={state === "loading" || !email.trim()}
        className="w-full bg-accent-brand text-bg-base hover:bg-accent-brand-hover"
      >
        {state === "loading" ? "Enviando..." : "Entrar com magic link"}
      </Button>
    </form>
  );
}
