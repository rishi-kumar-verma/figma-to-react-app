import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const res = await fetch("http://localhost:3001/health", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        isRunning: true,
        port: 3001,
        url: "http://localhost:3001",
        data,
      });
    }
  } catch {
    // runner might be offline
  }

  return NextResponse.json({
    isRunning: false,
    port: 3001,
    url: "http://localhost:3001",
    message: "Runner is starting up or offline",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch("http://localhost:3001/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ success: true, url: "http://localhost:3001", ...data });
    }

    return NextResponse.json({ success: false, url: "http://localhost:3001" });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || "Failed to notify live runner",
      url: "http://localhost:3001",
    });
  }
}
