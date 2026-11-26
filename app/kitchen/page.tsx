"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

type Order = {
  id: number; table_number: number; status: string; created_at: string;
  items: { dish_name: string; size: string; quantity: number; total_price: number }[];
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  COOKING: "bg-yellow-100 text-yellow-800",
  READY: "bg-green-100 text-green-800",
  SERVED: "bg-gray-100 text-gray-500",
};

export default function KitchenPage() {
  const { data: orders, mutate } = useSWR<Order[]>("/api/orders", fetcher, { refreshInterval: 3000 });

  const setStatus = async (orderId: number, status: string) => {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    mutate();
  };

  const active = orders?.filter(o => o.status !== "SERVED") ?? [];

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">👨‍🍳 Kitchen Board</h1>
      {active.length === 0 && <p className="text-gray-500">No active orders.</p>}

      <div className="grid gap-4">
        {active.map(o => (
          <div key={o.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Order #{o.id} · Table {o.table_number}</span>
              <span className={`px-2 py-0.5 rounded text-sm font-medium ${STATUS_COLORS[o.status] ?? ""}`}>
                {o.status}
              </span>
            </div>
            <ul className="text-sm space-y-0.5 mb-3">
              {o.items?.map((it, i) => (
                <li key={i}>
                  {it.dish_name} {it.size ? `(${it.size})` : ""} × {it.quantity}
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              {o.status === "NEW" && (
                <button onClick={() => setStatus(o.id, "COOKING")}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                  Start Cooking
                </button>
              )}
              {o.status === "COOKING" && (
                <button onClick={() => setStatus(o.id, "READY")}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                  Mark Ready
                </button>
              )}
              {o.status === "READY" && (
                <button onClick={() => setStatus(o.id, "SERVED")}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm">
                  Served
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
