import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plane, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Flight Price Notifier" },
      { name: "description", content: "Manage your flight fare alerts." },
      { property: "og:title", content: "Dashboard — Flight Price Notifier" },
      { property: "og:description", content: "Manage your flight fare alerts." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold">
            <Plane className="h-5 w-5 text-primary" />
            Flight Price Notifier
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="animate-fade-in rounded-3xl border border-border bg-card p-10 card-glow sm:p-14">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
            <Bell className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Welcome aboard, {user.email}
          </h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            你的票價追蹤儀表板即將上線。
            <br />
            <span className="text-sm">
              Route subscriptions, target prices, and fare tracking are coming
              in the next milestone.
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
