import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const { rows } = await query(`SELECT * FROM dishes ORDER BY id`);
  return NextResponse.json(rows);
}
