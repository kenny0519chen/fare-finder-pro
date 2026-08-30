import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";
import { Plane, Bell, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flight Price Notifier — 機票降價通知" },
      {
        name: "description",
        content:
          "Set a route and a target price — we email you when the fare drops. 設定航線與目標價，機票降價就通知你。",
      },
      { property: "og:title", content: "Flight Price Notifier — 機票降價通知" },
      {
        property: "og:description",
        content: "Set a route and a target price — we email you when the fare drops.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

const FEATURES = [
  {
    icon: Plane,
    title: "盯緊熱門航線",
    subtitle: "Always-on route watching",
    description: "持續監控台北出發的熱門航線（東京、首爾），自動抓最低票價。",
  },
  {
    icon: Bell,
    title: "達標自動通知",
    subtitle: "Target-price email alerts",
    description: "低於你設定的目標價，就寄 email 提醒你，附上立即訂購連結。",
  },
  {
    icon: XCircle,
    title: "隨時取消",
    subtitle: "Cancel anytime",
    description: "月訂閱制，不想用隨時停，沒有綁約。",
  },
];

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold">
            <Plane className="h-5 w-5 text-primary" />
            Flight Price Notifier
          </div>
          <Button asChild size="sm">
            <Link to="/auth">Sign in / 登入</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
        />
        <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 pb-24 pt-24 text-center sm:pt-32">
          <div className="animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <Plane className="h-4 w-4 animate-float text-primary" />
              台北出發 · Tokyo · Seoul
            </div>
          </div>
          <h1
            className="animate-fade-up text-4xl font-extrabold tracking-tight sm:text-6xl"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="glow-text">Flight Price Notifier</span>
          </h1>
          <p
            className="mt-6 animate-fade-up text-xl font-semibold sm:text-2xl"
            style={{ animationDelay: "0.2s" }}
          >
            設定航線與目標價，機票降價就通知你
          </p>
          <p
            className="mt-3 max-w-xl animate-fade-up text-muted-foreground"
            style={{ animationDelay: "0.3s" }}
          >
            Set a route and a target price — we email you when the fare drops.
          </p>
          <div className="mt-10 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <Button asChild size="lg" className="px-8">
              <Link to="/auth">
                Sign in / 登入
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <Reveal key={f.title}>
              <div className="h-full rounded-2xl border border-border bg-card p-8 transition-colors card-glow hover:border-primary/40">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-lg font-bold">{f.title}</h2>
                <p className="mt-1 text-sm font-medium text-primary">
                  {f.subtitle}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-center px-4 text-sm text-muted-foreground">
          © 2026 Flight Price Notifier
        </div>
      </footer>
    </div>
  );
}
