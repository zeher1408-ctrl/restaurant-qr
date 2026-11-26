import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/bill/[orderId] — itemized bill with split options
export async function GET(
  _request: Request,
  { params }: { params: { orderId: string } }
) {
  const { rows: items } = await query(
    `SELECT dish_name, size, quantity, unit_price, total_price
     FROM order_items WHERE order_id = $1`,
    [params.orderId]
  );

  if (!items.length) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const total = items.reduce((s: number, i: any) => s + i.total_price, 0);

  return NextResponse.json({
    orderId: Number(params.orderId),
    items,
    total,
    splits: {
      whole: total,
      two: Math.ceil(total / 2),
      three: Math.ceil(total / 3),
      four: Math.ceil(total / 4),
    },
    tipOptions: {
      "5%": Math.round(total * 0.05),
      "10%": Math.round(total * 0.1),
      "15%": Math.round(total * 0.15),
    },
  });
}
