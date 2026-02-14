"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { expenseSchema, type ExpenseFormData } from "@/lib/validations";
import { CATEGORIES } from "@/types";
import type { GroupMemberWithProfile } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface AddExpenseDialogProps {
  groupId: string;
  members: GroupMemberWithProfile[];
  currentUserId: string;
  onSuccess?: () => void;
}

export function AddExpenseDialog({
  groupId,
  members,
  currentUserId,
  onSuccess,
}: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [splitType, setSplitType] = useState<"equal" | "exact" | "percentage">("equal");
  const [shares, setShares] = useState
  { user_id: string; nickname: string; amount: number; included: boolean; percentage: number }[]
 >([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: "Other",
      expense_date: format(new Date(), "yyyy-MM-dd"),
      paid_by: currentUserId,
      split_type: "equal",
    },
  });

  const watchedAmount = watch("amount");

  useEffect(() => {
  const totalAmount = parseFloat(watchedAmount) || 0;
  const includedMembers = members.map((m) => ({
    user_id: m.user_id,
    nickname: m.profiles.nickname || "Unknown",
    amount: 0,
    included: true,
    percentage: 100 / members.length,
  }));

  if (splitType === "equal") {
    const perPerson = totalAmount / members.length;
    includedMembers.forEach((m) => (m.amount = Math.round(perPerson * 100) / 100));
  } else if (splitType === "percentage") {
    includedMembers.forEach((m) => {
      m.percentage = 100 / members.length;
      m.amount = Math.round((totalAmount * m.percentage) / 100 * 100) / 100;
    });
  }

  setShares(includedMembers);
}, [members, watchedAmount, splitType]);

  function updateShare(userId: string, value: number) {
    setShares((prev) => {
      const updated = prev.map((s) => {
        if (s.user_id === userId) {
          if (splitType === "percentage") {
            const total = parseFloat(watchedAmount) || 0;
            return { ...s, percentage: value, amount: Math.round((total * value) / 100 * 100) / 100 };
          }
          return { ...s, amount: value };
        }
        return s;
      });
      return updated;
    });
  }

  function toggleIncluded(userId: string) {
    setShares((prev) => {
      const updated = prev.map((s) =>
        s.user_id === userId ? { ...s, included: !s.included } : s
      );
      const includedCount = updated.filter((s) => s.included).length;
      const totalAmount = parseFloat(watchedAmount) || 0;
      if (splitType === "equal" && includedCount > 0) {
        const perPerson = Math.round((totalAmount / includedCount) * 100) / 100;
        return updated.map((s) => ({ ...s, amount: s.included ? perPerson : 0 }));
      }
      return updated;
    });
  }

  async function onSubmit(data: ExpenseFormData) {
  setLoading(true);
  try {
    const totalAmount = parseFloat(data.amount);
    const activeShares = shares.filter((s) => s.included);
    const sharesTotal = activeShares.reduce((sum, s) => sum + s.amount, 0);

    if (Math.abs(sharesTotal - totalAmount) > 0.02) {
      toast.error(
        `Shares total (৳${sharesTotal.toFixed(2)}) must equal expense amount (৳${totalAmount.toFixed(2)})`
      );
      return;
    }

    // ✅ USE API ROUTE INSTEAD OF DIRECT SUPABASE
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        group_id: groupId,
        paid_by: data.paid_by,
        amount: totalAmount,
        description: data.description,
        category: data.category,
        expense_date: data.expense_date,
        shares: activeShares.map((s) => ({
          user_id: s.user_id,
          amount: s.amount,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add expense');
    }

    toast.success("Expense added successfully!");
    reset();
    setOpen(false);
    onSuccess?.();
  } catch (err: unknown) {
    console.error('Add expense error:', err);
    toast.error(err instanceof Error ? err.message : 'Failed to add expense');
  } finally {
    setLoading(false);
  }
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full shadow-lg">
          <Plus className="h-5 w-5 mr-2" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Description</Label>
              <Input placeholder="e.g. Monthly groceries" {...register("description")} />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Amount (৳)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("amount")}
              />
              {errors.amount && (
                <p className="text-xs text-destructive">{errors.amount.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" {...register("expense_date")} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                defaultValue="Other"
                onValueChange={(v) => setValue("category", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Paid by</Label>
              <Select
                defaultValue={currentUserId}
                onValueChange={(v) => setValue("paid_by", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.user_id} value={m.user_id}>
                      {m.profiles.nickname || "Unknown"}
                      {m.user_id === currentUserId ? " (you)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Split Type</Label>
              <div className="flex gap-1">
                {(["equal", "exact", "percentage"] as const).map((type) => (
                  <Button
                    key={type}
                    type="button"
                    size="sm"
                    variant={splitType === type ? "default" : "outline"}
                    onClick={() => setSplitType(type)}
                    className="capitalize text-xs h-7 px-2"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {shares.map((share) => (
                <div key={share.user_id} className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => toggleIncluded(share.user_id)}
                  >
                    {share.included ? (
                      <Minus className="h-3 w-3 text-destructive" />
                    ) : (
                      <Plus className="h-3 w-3 text-primary" />
                    )}
                  </Button>
                  <span
                    className={`text-sm font-medium flex-1 ${!share.included ? "opacity-40 line-through" : ""}`}
                  >
                    {share.nickname}
                    {share.user_id === currentUserId ? " (you)" : ""}
                  </span>
                  {splitType === "percentage" ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        className="h-7 w-16 text-xs text-right"
                        value={share.percentage}
                        disabled={!share.included}
                        onChange={(e) => updateShare(share.user_id, parseFloat(e.target.value) || 0)}
                      />
                      <span className="text-xs text-muted-foreground">%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">৳</span>
                      <Input
                        type="number"
                        step="0.01"
                        className="h-7 w-20 text-xs text-right"
                        value={share.amount}
                        disabled={!share.included || splitType === "equal"}
                        onChange={(e) => updateShare(share.user_id, parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              <span>Total split:</span>
              <span className={
                Math.abs(shares.filter(s => s.included).reduce((sum, s) => sum + s.amount, 0) - (parseFloat(watchedAmount) || 0)) > 0.02
                  ? "text-destructive font-semibold"
                  : "text-emerald-500 font-semibold"
              }>
                ৳{shares.filter(s => s.included).reduce((sum, s) => sum + s.amount, 0).toFixed(2)} / ৳{(parseFloat(watchedAmount) || 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}