"use client";

import { useEffect, useState, useCallback } from "react";
import type { ExpenseWithDetails } from "@/types";

export function useRealtimeExpenses(groupId: string) {
  const [expenses, setExpenses] = useState<ExpenseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    try {
      // ✅ USE API ROUTE
      const response = await fetch(`/api/expenses?groupId=${groupId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }

      const { data } = await response.json();
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchExpenses();
    
    // Poll every 5 seconds for updates (replace real-time)
    const interval = setInterval(fetchExpenses, 5000);
    
    return () => clearInterval(interval);
  }, [fetchExpenses]);

  return { expenses, loading, refetch: fetchExpenses };
}