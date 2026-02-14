"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/types";
import { Search, X } from "lucide-react";

interface ExpenseFiltersProps {
  onFilterChange: (filters: {
    search: string;
    category: string;
    month: string;
    paidBy: string;
  }) => void;
  members: { user_id: string; nickname: string }[];
}

export function ExpenseFilters({ onFilterChange, members }: ExpenseFiltersProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [month, setMonth] = useState("all");
  const [paidBy, setPaidBy] = useState("all");

  const activeFilters = [search, category !== "all", month !== "all", paidBy !== "all"].filter(
    Boolean
  ).length;

  function update(
    field: "search" | "category" | "month" | "paidBy",
    value: string
  ) {
    const newFilters = { search, category, month, paidBy, [field]: value };
    if (field === "search") setSearch(value);
    if (field === "category") setCategory(value);
    if (field === "month") setMonth(value);
    if (field === "paidBy") setPaidBy(value);
    onFilterChange(newFilters);
  }

  function reset() {
    setSearch("");
    setCategory("all");
    setMonth("all");
    setPaidBy("all");
    onFilterChange({ search: "", category: "all", month: "all", paidBy: "all" });
  }

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return {
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("default", { month: "long", year: "numeric" }),
    };
  });

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => update("search", e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Select value={category} onValueChange={(v) => update("category", v)}>
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={month} onValueChange={(v) => update("month", v)}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All months</SelectItem>
            {months.map((m) => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={paidBy} onValueChange={(v) => update("paidBy", v)}>
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue placeholder="Paid by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Anyone</SelectItem>
            {members.map((m) => (
              <SelectItem key={m.user_id} value={m.user_id}>{m.nickname}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {activeFilters > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={reset}
          >
            <X className="h-3 w-3 mr-1" />
            Clear ({activeFilters})
          </Button>
        )}
      </div>
    </div>
  );
}