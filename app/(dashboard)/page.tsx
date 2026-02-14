import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Receipt, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const supabase = await createClient();
export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: groups } = await supabase
    .from("group_members")
    .select("group_id, role, groups(id, name, created_at)")
    .eq("user_id", user.id);

  const groupIds = (groups || []).map((g) => g.group_id);

  const { data: recentExpenses } = await supabase
    .from("expenses")
    .select("*, profiles!expenses_paid_by_fkey(nickname)")
    .in("group_id", groupIds.length ? groupIds : ["00000000-0000-0000-0000-000000000000"])
    .order("created_at", { ascending: false })
    .limit(5);

  const totalExpenses = (recentExpenses || []).reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {profile?.nickname || "there"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your dorms
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="h-11 w-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Groups</p>
              <p className="text-2xl font-bold">{groups?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recent Expenses</p>
              <p className="text-2xl font-bold">{recentExpenses?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="h-11 w-11 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recent Total</p>
              <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">My Groups</CardTitle>
            <Button size="sm" variant="ghost" asChild>
              <Link href="/dashboard/groups">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {!groups?.length ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-3">No groups yet</p>
                <Button size="sm" asChild>
                  <Link href="/dashboard/groups">
                    <Plus className="h-3 w-3 mr-1" />
                    Create or join a group
                  </Link>
                </Button>
              </div>
            ) : (
              groups.slice(0, 4).map((g) => (
                <Link
                  key={g.group_id}
                  href={`/dashboard/groups/${g.group_id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {(g.groups as { name: string } | null)?.name?.[0]?.toUpperCase() || "G"}
                    </div>
                    <span className="font-medium text-sm">
                      {(g.groups as { name: string } | null)?.name}
                    </span>
                  </div>
                  <Badge variant={g.role === "admin" ? "default" : "secondary"} className="text-xs">
                    {g.role}
                  </Badge>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {!recentExpenses?.length ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No expenses yet
              </p>
            ) : (
              recentExpenses.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{e.description}</p>
                    <p className="text-xs text-muted-foreground">
                      by {(e.profiles as { nickname: string } | null)?.nickname || "Unknown"}
                    </p>
                  </div>
                  <span className="font-semibold text-sm ml-2 shrink-0">
                    ৳{Number(e.amount).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}