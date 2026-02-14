"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Copy,
  LogOut,
  Users,
  Receipt,
  BarChart3,
  Scale,
  HandCoins,
  Settings,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddExpenseDialog } from "@/components/expenses/add-expense-dialog";
import { ExpensesTab } from "./expenses-tab";
import { BalancesTab } from "./balances-tab";
import { SettlementsTab } from "./settlements-tab";
import { AnalyticsTab } from "./analytics-tab";
import { MembersTab } from "./members-tab";
import { createClient } from "@/lib/supabase/client";
import { copyToClipboard } from "@/lib/utils";
import type { Group, GroupMemberWithProfile } from "@/types";

interface GroupDashboardProps {
  group: Group;
  members: GroupMemberWithProfile[];
  currentUserId: string;
  isAdmin: boolean;
}

export function GroupDashboard({
  group,
  members,
  currentUserId,
  isAdmin,
}: GroupDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("expenses");

  async function handleLeave() {
    if (!confirm("Leave this group? You can rejoin with the Group ID.")) return;
    const supabase = createClient();
    const { error } = await supabase.rpc("leave_group", { group_uuid: group.id });
    if (error) {
      toast.error("Failed to leave group");
      return;
    }
    toast.success("Left group");
    router.push("/dashboard/groups");
    router.refresh();
  }

  async function handleCopyId() {
    await copyToClipboard(group.id);
    toast.success("Group ID copied to clipboard!");
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{group.name}</h1>
            {isAdmin && (
              <Badge variant="default" className="text-xs">Admin</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {members.length} member{members.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleCopyId}>
            <Copy className="h-3.5 w-3.5 mr-1.5" />
            Copy ID
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLeave}
            className="text-destructive hover:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            Leave
          </Button>
          <AddExpenseDialog
            groupId={group.id}
            members={members}
            currentUserId={currentUserId}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1 w-full justify-start bg-muted/60 p-1.5">
          <TabsTrigger value="expenses" className="gap-1.5 text-xs">
            <Receipt className="h-3.5 w-3.5" />
            Expenses
          </TabsTrigger>
          <TabsTrigger value="balances" className="gap-1.5 text-xs">
            <Scale className="h-3.5 w-3.5" />
            Balances
          </TabsTrigger>
          <TabsTrigger value="settlements" className="gap-1.5 text-xs">
            <HandCoins className="h-3.5 w-3.5" />
            Settle Up
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1.5 text-xs">
            <BarChart3 className="h-3.5 w-3.5" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" />
            Members
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="expenses">
            <ExpensesTab
              groupId={group.id}
              members={members}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          </TabsContent>
          <TabsContent value="balances">
            <BalancesTab groupId={group.id} />
          </TabsContent>
          <TabsContent value="settlements">
            <SettlementsTab groupId={group.id} currentUserId={currentUserId} />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsTab groupId={group.id} />
          </TabsContent>
          <TabsContent value="members">
            <MembersTab
              groupId={group.id}
              members={members}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}