"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

type Stats = {
  liveOrders: number;
  activeTables: number;
  todaySales: number;
  hourlyFlow: { hour: number; count: number }[];
};

export default function DashboardPage() {
  const { data } = useSWR<Stats>("/api/dashboard", fetcher, { refreshInterval: 5000 });

  if (!data) return <main className="p-4"><p>Loading…</p></main>;

  const maxCount = Math.max(...(data.hourlyFlow.map(h => Number(h.count))), 1);

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📊 Dashboard</h1>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold">{data.liveOrders}</p>
          <p className="text-gray-500">Live Orders</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold">{data.activeTables}/10</p>
          <p className="text-gray-500">Tables Active</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold">Rs {data.todaySales.toLocaleString()}</p>
          <p className="text-gray-500">Today Sales</p>
        </div>
      </div>

      {/* Guest flow chart (simple bar chart) */}
      <section className="border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Guest Flow (orders by hour)</h2>
        {data.hourlyFlow.length === 0 && <p className="text-sm text-gray-400">No orders today yet.</p>}
        <div className="flex items-end gap-1 h-32">
          {data.hourlyFlow.map(h => (
            <div key={h.hour} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${(Number(h.count) / maxCount) * 100}%`, minHeight: 4 }}
              />
              <span className="text-xs mt-1">{h.hour}h</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
