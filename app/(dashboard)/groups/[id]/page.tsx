export const dynamic = 'force-dynamic';
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GroupDashboard } from "./group-dashboard";
import type { Metadata } from "next";

interface Props {
  params: { id: string };
}
const supabase = await createClient();
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data: group } = await supabase
    .from("groups")
    .select("name")
    .eq("id", params.id)
    .single();
  return { title: group ? `${group.name} — DormApp` : "Group — DormApp" };
}

export default async function GroupPage({ params }: Props) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: group } = await supabase
    .from("groups")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!group) notFound();

  const { data: members } = await supabase
    .from("group_members")
    .select("*, profiles(*)")
    .eq("group_id", params.id);

  const currentMember = members?.find((m) => m.user_id === user.id);
  if (!currentMember) redirect("/dashboard/groups");

  return (
    <GroupDashboard
      group={group}
      members={(members as any) || []}
      currentUserId={user.id}
      isAdmin={currentMember.role === "admin"}
    />
  );
}
