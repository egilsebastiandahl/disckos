import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

function getSupabaseWithToken(token: string) {
  return createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

// GET /api/event/photos?eventId=xxx — fetch photos for an event (or all if no eventId)
export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  let query = supabase
    .from("event_photos")
    .select("id, event_id, profile_id, storage_path, caption, created_at, profiles(display_name, avatar_url)")
    .order("created_at", { ascending: false });

  if (eventId) {
    query = query.eq("event_id", eventId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map storage paths to public URLs
  const photos = (data ?? []).map((photo: any) => ({
    id: photo.id,
    eventId: photo.event_id,
    profileId: photo.profile_id,
    caption: photo.caption,
    createdAt: photo.created_at,
    displayName: photo.profiles?.display_name ?? null,
    avatarUrl: photo.profiles?.avatar_url ?? null,
    imageUrl: `${supabaseUrl}/storage/v1/object/public/event-photos/${photo.storage_path}`,
  }));

  return NextResponse.json(photos);
}

// POST /api/event/photos — upload a photo
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const supabase = getSupabaseWithToken(token);

  // Verify user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = userData.user.id;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const eventId = formData.get("eventId") as string | null;
  const caption = formData.get("caption") as string | null;

  if (!file || !eventId) {
    return NextResponse.json({ error: "File and eventId are required" }, { status: 400 });
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type. Use JPEG, PNG, or WebP." }, { status: 400 });
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
  }

  // Verify event exists and is within ±1 day
  const adminSupabase = getSupabaseAdmin();
  const { data: event, error: eventError } = await adminSupabase
    .from("events")
    .select("id, date")
    .eq("id", eventId)
    .single();

  if (eventError || !event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const eventDate = new Date(event.date);
  const now = new Date();
  const diffMs = Math.abs(now.getTime() - eventDate.getTime());
  const oneDayMs = 24 * 60 * 60 * 1000;

  if (diffMs > oneDayMs) {
    return NextResponse.json(
      { error: "Kan kun laste opp bilder ±1 dag fra eventet." },
      { status: 403 }
    );
  }

  // Upload file to Supabase Storage
  const fileExt = file.name.split(".").pop() ?? "jpg";
  const fileName = `${userId}/${eventId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("event-photos")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: "Upload failed: " + uploadError.message }, { status: 500 });
  }

  // Insert metadata record
  const { data: photoRecord, error: insertError } = await adminSupabase
    .from("event_photos")
    .insert({
      event_id: eventId,
      profile_id: userId,
      storage_path: fileName,
      caption: caption || null,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: "Failed to save metadata: " + insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    id: photoRecord.id,
    eventId: photoRecord.event_id,
    imageUrl: `${supabaseUrl}/storage/v1/object/public/event-photos/${fileName}`,
    caption: photoRecord.caption,
    createdAt: photoRecord.created_at,
  }, { status: 201 });
}
