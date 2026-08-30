import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Plane, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Flight Price Notifier" },
      { name: "description", content: "Sign in to manage your fare alerts." },
      { property: "og:title", content: "Sign in — Flight Price Notifier" },
      { property: "og:description", content: "Sign in to manage your fare alerts." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "info"; text: string } | null>(null);

  // If already signed in, go straight to the dashboard.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") navigate({ to: "/dashboard", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ kind: "error", text: error.message });
      }
      // Success handled by onAuthStateChange → redirect to /dashboard
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        setMessage({ kind: "error", text: error.message });
      } else if (!data.session) {
        setMessage({
          kind: "info",
          text: "Check your email to confirm your account, then sign in.",
        });
      }
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Plane className="h-5 w-5 text-primary" />
            Flight Price Notifier
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md animate-fade-up">
          <div className="rounded-3xl border border-border bg-card p-8 card-glow sm:p-10">
            <h1 className="text-2xl font-bold">
              {mode === "signin" ? "Welcome back．登入" : "Create account．註冊"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to manage your fare alerts."
                : "Create an account to start tracking fares."}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary"
                />
              </div>

              {message && (
                <p
                  className={
                    message.kind === "error"
                      ? "text-sm text-destructive"
                      : "text-sm text-primary"
                  }
                  role={message.kind === "error" ? "alert" : "status"}
                >
                  {message.text}
                </p>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "signin" ? "Sign in / 登入" : "Create account / 註冊"}
              </Button>
            </form>

            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setMessage(null);
              }}
              className="mt-6 w-full text-center text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {mode === "signin"
                ? "No account yet? Create one"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
