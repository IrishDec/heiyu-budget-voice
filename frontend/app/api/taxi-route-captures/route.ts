import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

type SaveBody = {
  name?: string;
  startedAt: string;
  endedAt: string;
  coordinates: [number, number][];
  distanceMeters?: number;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SaveBody;

    if (!body.coordinates || body.coordinates.length < 2) {
      return NextResponse.json(
        { error: "At least 2 coordinates are required" },
        { status: 400 }
      );
    }

    const route = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: body.coordinates,
      },
      properties: {},
    };

    const { data, error } = await supabase
      .from("taxi_route_captures")
      .insert({
        name: body.name ?? null,
        started_at: body.startedAt,
        ended_at: body.endedAt,
        route,
        point_count: body.coordinates.length,
        distance_meters: body.distanceMeters ?? null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ capture: data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}