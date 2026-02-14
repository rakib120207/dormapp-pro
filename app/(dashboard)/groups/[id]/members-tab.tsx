"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Crown, UserMinus, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { GroupMemberWithProfile } from "@/types";

interface MembersTabProps {
  groupId: string;
  members: GroupMemberWithProfile[];
  currentUserId: string;
  isAdmin: boolean;
}

export function MembersTab({
  groupId,
  members,
  currentUserId,
  isAdmin,
}: MembersTabProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleRemove(userId: string, nickname: string) {
    if (!confirm(`Remove ${nickname} from the group?`)) return;
    setLoading(userId);
    try {
      const supabase = createClient();
      const { error } = await supabase.rpc("remove_member", {
        group_uuid: groupId,
        member_uuid: userId,
      });
      if (error) throw error;
      toast.success(`${nickname} removed from group`);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to remove member");
    } finally {
      setLoading(null);
    }
  }

  async function handleToggleRole(
    userId: string,
    currentRole: "admin" | "member",
    nickname: string
  ) {
    const newRole = currentRole === "admin" ? "member" : "admin";
    if (!confirm(`Change ${nickname}'s role to ${newRole}?`)) return;
    setLoading(userId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("group_members")
        .update({ role: newRole })
        .eq("group_id", groupId)
        .eq("user_id", userId);
      if (error) throw error;
      toast.success(`${nickname} is now ${newRole}`);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-3">
      {members
        .sort((a, b) => {
          if (a.role === "admin" && b.role !== "admin") return -1;
          if (a.role !== "admin" && b.role === "admin") return 1;
          return 0;
        })
        .map((m) => {
          const nickname = m.profiles?.nickname || "Unknown";
          const isCurrentUser = m.user_id === currentUserId;
          return (
            <Card key={m.id} className="glass">
              <CardContent className="p-4 flex items-center gap-4">
                <UserAvatar
                  nickname={nickname}
                  avatarUrl={m.profiles?.avatar_url}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{nickname}</span>
                    {isCurrentUser && (
                      <Badge variant="outline" className="text-xs">You</Badge>
                    )}
                    <Badge variant={m.role === "admin" ? "default" : "secondary"} className="text-xs">
                      {m.role === "admin" && <Crown className="h-2.5 w-2.5 mr-1" />}
                      {m.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Joined {formatDate(m.joined_at)}
                  </p>
                </div>
                {isAdmin && !isCurrentUser && (
                  <div className="flex gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => handleToggleRole(m.user_id, m.role as "admin" | "member", nickname)}
                      disabled={loading === m.user_id}
                      title={m.role === "admin" ? "Remove admin" : "Make admin"}
                    >
                      <Shield className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemove(m.user_id, nickname)}
                      disabled={loading === m.user_id}
                    >
                      <UserMinus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}