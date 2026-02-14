"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GroupBalance } from "@/types";

interface MemberSpendingProps {
  balances: GroupBalance[];
}

export function MemberSpending({ balances }: MemberSpendingProps) {
  const data = balances.map((b) => ({
    name: b.nickname,
    paid: Number(b.total_paid),
    owes: Number(b.total_share),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Paid vs. Owed per Member</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${v}`} />
            <Tooltip
              formatter={(value: number, name: string) => [
                `৳${value.toFixed(2)}`,
                name === "paid" ? "Paid" : "Share",
              ]}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="paid" fill="#10b981" radius={[4, 4, 0, 0]} name="paid" />
            <Bar dataKey="owes" fill="#3b82f6" radius={[4, 4, 0, 0]} name="owes" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}