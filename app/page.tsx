import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Receipt,
  BarChart3,
  HandCoins,
  Shield,
  Zap,
  Check,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "DormApp — Smart Expense Splitting for Roommates & Students",
  description:
    "The easiest way for roommates, dorm residents, and flatmates to track shared expenses, split bills fairly, and settle debts without the drama. 100% free.",
};

const features = [
  {
    icon: Receipt,
    title: "Smart Expense Tracking",
    description: "Add expenses in seconds with custom split options — equal, exact, or percentage.",
  },
  {
    icon: HandCoins,
    title: "Intelligent Settlements",
    description: "Minimize transactions with our debt-simplification algorithm.",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description: "See spending trends, category breakdowns, and member spending at a glance.",
  },
  {
    icon: Users,
    title: "Group Management",
    description: "Manage members, roles, and permissions. Admins have full control.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Row-level security ensures only group members can see group data.",
  },
  {
    icon: Zap,
    title: "Real-time Sync",
    description: "Expenses appear instantly for all members — no refresh needed.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-950/30">
      <header className="container max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
  <div className="h-7 w-7 rounded-lg overflow-hidden">
    <img 
      src="/icon-512x512.png" 
      alt="DormApp" 
      className="w-full h-full object-cover"
    />
  </div>
  <span className="font-semibold">DormApp</span>
</div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="container max-w-4xl mx-auto px-4 py-20 text-center">
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-1.5">
            Free for students & roommates
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            Split bills fairly.
            <br />
            Zero drama.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            DormApp makes it effortless to track shared expenses, split costs fairly,
            and settle up with your roommates — in seconds.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="text-base px-8" asChild>
              <Link href="/signup">
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required. Works on any device.
          </p>
        </section>

        <section className="container max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Everything you need to manage dorm finances
            </h2>
            <p className="text-muted-foreground">
              From tracking groceries to settling rent — we've got it covered.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-2xl border bg-card/60 backdrop-blur-sm p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-200"
                >
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="container max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="rounded-2xl border bg-card/60 backdrop-blur-sm p-10">
            <h2 className="text-3xl font-bold mb-3">Ready to stop the awkward money talk?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of roommates managing shared expenses with DormApp.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {[
                "Free forever",
                "Real-time sync",
                "Custom splits",
                "CSV export",
                "Debt minimization",
              ].map((p) => (
                <div key={p} className="flex items-center gap-1.5 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="px-10 text-base" asChild>
              <Link href="/signup">
                Create free account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container max-w-5xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
         <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-4 overflow-hidden">
  <img 
    src="/icon-512x512.png" 
    alt="DormApp" 
    className="w-10 h-10 object-cover"
  />
</div>
            <span className="font-bold text-xl">DormApp</span>
         </div>
          <p className="text-sm text-muted-foreground">
            Built for students. Free forever.
          </p>
        </div>
      </footer>
    </div>
  );
}