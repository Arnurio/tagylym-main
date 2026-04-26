import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { page_path } = await request.json();
    if (!page_path || typeof page_path !== "string") {
      return NextResponse.json({ error: "page_path required" }, { status: 400 });
    }

    // Read or generate visitor_id from cookie
    let visitorId = request.cookies.get("tg_visitor")?.value;
    const isNew = !visitorId;
    if (!visitorId) {
      visitorId = crypto.randomUUID();
    }

    const supabase = await createClient();
    await supabase.from("page_visits").insert({
      page_path,
      visitor_id: visitorId,
    });

    const response = NextResponse.json({ ok: true });
    if (isNew) {
      response.cookies.set("tg_visitor", visitorId, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      });
    }
    return response;
  } catch {
    return NextResponse.json({ error: "Failed to log visit" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_visit_stats");
    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { total_visits: 0, unique_visitors: 0, today_visits: 0 },
      { status: 500 }
    );
  }
}
