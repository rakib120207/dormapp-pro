import type { Database } from "./database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Group = Database["public"]["Tables"]["groups"]["Row"];
export type GroupMember = Database["public"]["Tables"]["group_members"]["Row"];
export type Expense = Database["public"]["Tables"]["expenses"]["Row"];
export type ExpenseShare = Database["public"]["Tables"]["expense_shares"]["Row"];

export type GroupMemberWithProfile = GroupMember & {
  profiles: Profile;
};

export type ExpenseWithDetails = Expense & {
  profiles: Profile | null;
  expense_shares: (ExpenseShare & { profiles: Profile })[];
};

export type GroupBalance = {
  user_id: string;
  nickname: string;
  avatar_url: string | null;
  total_paid: number;
  total_share: number;
  balance: number;
};

export type Settlement = {
  from: string;
  fromId: string;
  to: string;
  toId: string;
  amount: number;
};

export type SplitType = "equal" | "exact" | "percentage";

export type SplitMember = {
  user_id: string;
  nickname: string;
  amount: number;
  percentage?: number;
  included?: boolean;
};

export type CategoryData = {
  name: string;
  value: number;
  color: string;
};

export type MonthlyData = {
  month: string;
  total: number;
};

export const CATEGORIES = [
  "Food",
  "Rent",
  "Supplies",
  "Utilities",
  "Transportation",
  "Entertainment",
  "Healthcare",
  "Groceries",
  "Internet",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  Food: "#10b981",
  Rent: "#3b82f6",
  Supplies: "#f59e0b",
  Utilities: "#8b5cf6",
  Transportation: "#06b6d4",
  Entertainment: "#ec4899",
  Healthcare: "#ef4444",
  Groceries: "#84cc16",
  Internet: "#f97316",
  Other: "#6b7280",
};