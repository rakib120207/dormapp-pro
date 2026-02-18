import { createClient } from "@/lib/supabase/server"; // or your path
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // This must be at the very top level

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 1 });
    }

    // ... your logic
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
