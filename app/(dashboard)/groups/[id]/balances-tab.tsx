"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import type { GroupBalance } from "@/types";

interface BalancesTabProps {
  groupId: string;
}

export function BalancesTab({ groupId }: BalancesTabProps) {
  const [balances, setBalances] = useState<GroupBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.rpc("get_group_balances", {
        group_uuid: groupId,
      });
      setBalances((data as GroupBalance[]) || []);
      setLoading(false);
    }
    load();
  }, [groupId]);

  const grandTotal = balances.reduce((sum, b) => sum + Number(b.total_paid), 0);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Grand Total</p>
            <p className="text-2xl font-bold">৳{grandTotal.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Per person</p>
            <p className="text-lg font-semibold">
              ৳{balances.length ? (grandTotal / balances.length).toFixed(2) : "0.00"}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {balances
          .sort((a, b) => Number(b.balance) - Number(a.balance))
          .map((b, idx) => {
            const balance = Number(b.balance);
            const isPositive = balance > 0.01;
            const isNegative = balance < -0.01;
            return (
              <Card key={b.user_id} className="glass">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <UserAvatar
                        nickname={b.nickname}
                        avatarUrl={b.avatar_url}
                        size="md"
                      />
                      <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{b.nickname}</p>
                      <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                        <span>Paid: ৳{Number(b.total_paid).toFixed(2)}</span>
                        <span>Share: ৳{Number(b.total_share).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`flex items-center gap-1 font-bold ${
                          isPositive
                            ? "text-emerald-500"
                            : isNegative
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : isNegative ? (
                          <TrendingDown className="h-4 w-4" />
                        ) : (
                          <Minus className="h-4 w-4" />
                        )}
                        ৳{Math.abs(balance).toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isPositive
                          ? "gets back"
                          : isNegative
                          ? "owes"
                          : "settled"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}