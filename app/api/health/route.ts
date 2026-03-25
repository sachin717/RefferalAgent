import { startServer } from "@/app/lib/serverStart";
import { NextResponse } from "next/server";


startServer();

export async function GET() {
  return NextResponse.json({
    ok: true,
  });
}