"use client";

import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { SpendingByCategory } from "@/components/charts/spending-by-category";
import { MonthlySpending } from "@/components/charts/monthly-spending";
import { MemberSpending } from "@/components/charts/member-spending";
import { createClient } from "@/lib/supabase/client";
import { CATEGORY_COLORS } from "@/types";
import type { ExpenseWithDetails, GroupBalance, CategoryData, MonthlyData } from "@/types";

interface AnalyticsTabProps {
  groupId: string;
}

export function AnalyticsTab({ groupId }: AnalyticsTabProps) {
  const [expenses, setExpenses] = useState<ExpenseWithDetails[]>([]);
  const [balances, setBalances] = useState<GroupBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: exp }, { data: bal }] = await Promise.all([
        supabase
          .from("expenses")
          .select("*, profiles!expenses_paid_by_fkey(*), expense_shares(*, profiles(*))")
          .eq("group_id", groupId)
          .order("expense_date", { ascending: true }),
        supabase.rpc("get_group_balances", { group_uuid: groupId }),
      ]);
      setExpenses((exp as ExpenseWithDetails[]) || []);
      setBalances((bal as GroupBalance[]) || []);
      setLoading(false);
    }
    load();
  }, [groupId]);

  const categoryData: CategoryData[] = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      const cat = e.category || "Other";
      map[cat] = (map[cat] || 0) + Number(e.amount);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || "#6b7280" }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const monthlyData: MonthlyData[] = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      const month = format(new Date(e.expense_date), "MMM yy");
      map[month] = (map[month] || 0) + Number(e.amount);
    });
    return Object.entries(map).map(([month, total]) => ({ month, total }));
  }, [expenses]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SpendingByCategory data={categoryData} />
      <MonthlySpending data={monthlyData} />
      <MemberSpending balances={balances} />
    </div>
  );
}