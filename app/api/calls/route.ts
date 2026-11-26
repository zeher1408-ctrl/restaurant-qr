import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// POST: guest taps "Call waiter"
export async function POST(request: Request) {
  const { tableId, type } = await request.json();
  const valid = ["water", "bill", "help"];
  if (!tableId || !valid.includes(type)) {
    return NextResponse.json({ error: "tableId and type (water|bill|help) required" }, { status: 400 });
  }
  const { rows } = await query(
    `INSERT INTO calls (table_id, type) VALUES ($1, $2) RETURNING id`,
    [tableId, type]
  );
  return NextResponse.json({ callId: rows[0].id });
}

// GET: list active calls
export async function GET() {
  const { rows } = await query(
    `SELECT c.*, t.number AS table_number FROM calls c
     JOIN tables t ON c.table_id = t.id
     WHERE c.status != 'DONE'
     ORDER BY c.created_at DESC`
  );
  return NextResponse.json(rows);
}

// PATCH: mark call as ON_THE_WAY or DONE
export async function PATCH(request: Request) {
  const { callId, status } = await request.json();
  const valid = ["ON_THE_WAY", "DONE"];
  if (!valid.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  await query(`UPDATE calls SET status = $1 WHERE id = $2`, [status, callId]);
  return NextResponse.json({ ok: true });
}
