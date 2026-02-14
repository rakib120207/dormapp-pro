"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Download, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExpenseCard } from "@/components/expenses/expense-card";
import { ExpenseFilters } from "@/components/expenses/expense-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { useRealtimeExpenses } from "@/hooks/use-realtime-expenses";
import type { GroupMemberWithProfile } from "@/types";

interface ExpensesTabProps {
  groupId: string;
  members: GroupMemberWithProfile[];
  currentUserId: string;
  isAdmin: boolean;
}

export function ExpensesTab({
  groupId,
  members,
  currentUserId,
  isAdmin,
}: ExpensesTabProps) {
  const { expenses, loading, refetch } = useRealtimeExpenses(groupId);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    month: "all",
    paidBy: "all",
  });

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (
        filters.search &&
        !e.description?.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      if (filters.category !== "all" && e.category !== filters.category) return false;
      if (filters.month !== "all") {
        const eMonth = format(new Date(e.expense_date), "yyyy-MM");
        if (eMonth !== filters.month) return false;
      }
      if (filters.paidBy !== "all" && e.paid_by !== filters.paidBy) return false;
      return true;
    });
  }, [expenses, filters]);

  const monthlyTotal = useMemo(() => {
    const now = format(new Date(), "yyyy-MM");
    return expenses
      .filter((e) => format(new Date(e.expense_date), "yyyy-MM") === now)
      .reduce((sum, e) => sum + Number(e.amount), 0);
  }, [expenses]);

  function handleExport() {
    if (!filtered.length) {
      toast.error("No expenses to export");
      return;
    }
    const rows = [
      ["Date", "Description", "Category", "Amount", "Paid By"],
      ...filtered.map((e) => [
        e.expense_date,
        e.description || "",
        e.category || "",
        e.amount.toString(),
        e.profiles?.nickname || "",
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Expenses exported!");
  }

  const membersList = members.map((m) => ({
    user_id: m.user_id,
    nickname: m.profiles?.nickname || "Unknown",
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-sm text-muted-foreground">
            This month:{" "}
            <span className="font-semibold text-foreground">
              ৳{monthlyTotal.toFixed(2)}
            </span>
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Export CSV
        </Button>
      </div>

      <ExpenseFilters onFilterChange={setFilters} members={membersList} />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : !filtered.length ? (
        <EmptyState
          icon={Receipt}
          title="No expenses found"
          description={
            filters.search || filters.category !== "all" || filters.month !== "all"
              ? "Try adjusting your filters"
              : "Add your first expense using the button above"
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onDelete={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
}