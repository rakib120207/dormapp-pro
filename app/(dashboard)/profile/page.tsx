import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";
import type { Metadata } from "next";
const supabase = await createClient();

export const metadata: Metadata = { title: "Profile — DormApp" };

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <div className="max-w-lg space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account settings
        </p>
      </div>
      <ProfileForm user={user!} profile={profile} />
    </div>
  );
}