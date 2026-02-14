"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, HandCoins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateSettlements } from "@/lib/utils/settlements";
import { createClient } from "@/lib/supabase/client";
import type { GroupBalance, Settlement } from "@/types";

interface SettlementsTabProps {
  groupId: string;
  currentUserId: string;
}

export function SettlementsTab({ groupId, currentUserId }: SettlementsTabProps) {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.rpc("get_group_balances", {
        group_uuid: groupId,
      });
      const calculated = calculateSettlements((data as GroupBalance[]) || []);
      setSettlements(calculated);
      setLoading(false);
    }
    load();
  }, [groupId]);

  function togglePaid(key: string) {
    setPaid((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const pending = settlements.filter((_, i) => !paid.has(`${i}`));
  const done = settlements.filter((_, i) => paid.has(`${i}`));

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!settlements.length) {
    return (
      <EmptyState
        icon={HandCoins}
        title="All settled up! 🎉"
        description="No payments needed. Everyone is even."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {pending.length} payment{pending.length !== 1 ? "s" : ""} needed
        </p>
        {paid.size > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setPaid(new Set())}
          >
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {settlements.map((s, i) => {
          const key = `${i}`;
          const isPaid = paid.has(key);
          const isMyDebt = s.fromId === currentUserId;
          const imReceiving = s.toId === currentUserId;
          return (
            <Card
              key={i}
              className={`transition-all duration-200 ${
                isPaid ? "opacity-50" : "glass"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="flex flex-col items-center min-w-0">
                      <span
                        className={`font-semibold text-sm truncate ${
                          isMyDebt ? "text-destructive" : ""
                        }`}
                      >
                        {s.from}
                        {isMyDebt ? " (you)" : ""}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex flex-col items-center min-w-0">
                      <span
                        className={`font-semibold text-sm truncate ${
                          imReceiving ? "text-emerald-500" : ""
                        }`}
                      >
                        {s.to}
                        {imReceiving ? " (you)" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-lg">৳{s.amount.toFixed(2)}</span>
                    <Button
                      size="sm"
                      variant={isPaid ? "secondary" : isMyDebt ? "default" : "outline"}
                      className="h-8 text-xs"
                      onClick={() => togglePaid(key)}
                    >
                      {isPaid ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                          Paid
                        </>
                      ) : isMyDebt ? (
                        "Mark Paid"
                      ) : (
                        "Confirm"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {done.length > 0 && (
        <p className="text-xs text-center text-muted-foreground">
          {done.length} payment{done.length !== 1 ? "s" : ""} marked as done (session only)
        </p>
      )}
    </div>
  );
}