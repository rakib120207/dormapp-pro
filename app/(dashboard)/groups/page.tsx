import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateGroupDialog } from "@/components/groups/create-group-dialog";
import { JoinGroupDialog } from "@/components/groups/join-group-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Users, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
const supabase = await createClient();

export const metadata: Metadata = { title: "My Groups — DormApp" };

export default async function GroupsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: memberships } = await supabase
    .from("group_members")
    .select(
      `
      role,
      joined_at,
      groups(id, name, created_at, created_by)
    `
    )
    .eq("user_id", user!.id)
    .order("joined_at", { ascending: false });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Groups</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {memberships?.length || 0} group{memberships?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <JoinGroupDialog />
          <CreateGroupDialog />
        </div>
      </div>

      {!memberships?.length ? (
        <EmptyState
          icon={Users}
          title="No groups yet"
          description="Create a new dorm group or join an existing one with a Group ID."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {memberships.map((m) => {
            const group = m.groups as {
              id: string;
              name: string;
              created_at: string;
              created_by: string;
            } | null;
            if (!group) return null;
            return (
              <Card
                key={group.id}
                className="glass group hover:shadow-lg transition-all duration-200"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                      {group.name[0].toUpperCase()}
                    </div>
                    <Badge variant={m.role === "admin" ? "default" : "secondary"}>
                      {m.role}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{group.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created {formatDate(group.created_at)}
                  </p>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="mt-4 w-full justify-between group-hover:bg-primary/10 group-hover:text-primary"
                  >
                    <Link href={`/dashboard/groups/${group.id}`}>
                      Open group
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}