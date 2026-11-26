import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const orders = await query(
    `SELECT COUNT(*) AS count FROM orders WHERE status IN ('NEW','COOKING')`
  );
  const tables = await query(
    `SELECT COUNT(DISTINCT table_id) AS count FROM orders WHERE status IN ('NEW','COOKING')`
  );
  const sales = await query(
    `SELECT COALESCE(SUM(total_price), 0) AS total FROM order_items
     WHERE order_id IN (SELECT id FROM orders WHERE created_at::date = CURRENT_DATE)`
  );
  const hourly = await query(
    `SELECT EXTRACT(HOUR FROM created_at) AS hour, COUNT(*) AS count
     FROM orders WHERE created_at::date = CURRENT_DATE
     GROUP BY hour ORDER BY hour`
  );

  return NextResponse.json({
    liveOrders: Number(orders.rows[0].count),
    activeTables: Number(tables.rows[0].count),
    todaySales: Number(sales.rows[0].total),
    hourlyFlow: hourly.rows,
  });
}
