"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Trash2, ChevronDown, ChevronUp, Edit } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/user-avatar";
import { CATEGORY_COLORS } from "@/types";
import type { ExpenseWithDetails } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface ExpenseCardProps {
  expense: ExpenseWithDetails;
  currentUserId: string;
  isAdmin: boolean;
  onDelete?: () => void;
}

export function ExpenseCard({ expense, currentUserId, isAdmin, onDelete }: ExpenseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canDelete = isAdmin || expense.paid_by === currentUserId;
  const paidBy = expense.profiles;
  const bgColor = CATEGORY_COLORS[expense.category || "Other"] || CATEGORY_COLORS.Other;

  async function handleDelete() {
    if (!confirm("Delete this expense? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", expense.id);
      if (error) throw error;
      toast.success("Expense deleted");
      onDelete?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="h-10 w-10 rounded-lg shrink-0 flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: bgColor }}
          >
            {expense.category?.[0] || "O"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">
                  {expense.description || "Unnamed expense"}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <Badge variant="outline" className="text-xs py-0 px-1.5">
                    {expense.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(expense.expense_date), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-lg">৳{Number(expense.amount).toFixed(2)}</p>
                {paidBy && (
                  <p className="text-xs text-muted-foreground">
                    by {paidBy.nickname}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {expense.expense_shares.length} split
                {expanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
              {canDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {expanded && expense.expense_shares.length > 0 && (
              <div className="mt-3 space-y-1 border-t pt-2">
                {expense.expense_shares.map((share) => (
                  <div key={share.id} className="flex justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <UserAvatar
                        nickname={share.profiles?.nickname || "?"}
                        avatarUrl={share.profiles?.avatar_url}
                        size="sm"
                      />
                      <span>{share.profiles?.nickname || "Unknown"}</span>
                    </div>
                    <span className="font-medium">৳{Number(share.amount).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}