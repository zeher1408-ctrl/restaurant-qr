"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

type Call = {
  id: number; table_number: number; type: string; status: string; created_at: string;
};

const TYPE_EMOJI: Record<string, string> = { water: "💧", bill: "🧾", help: "🙋" };

export default function FloorPage() {
  const { data: calls, mutate } = useSWR<Call[]>("/api/calls", fetcher, { refreshInterval: 2000 });

  const updateCall = async (callId: number, status: string) => {
    await fetch("/api/calls", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callId, status }),
    });
    mutate();
  };

  // Build a 10-table grid
  const tables = Array.from({ length: 10 }, (_, i) => i + 1);

  // Active calls by table
  const callsByTable = new Map<number, Call[]>();
  for (const c of calls ?? []) {
    const list = callsByTable.get(c.table_number) ?? [];
    list.push(c);
    callsByTable.set(c.table_number, list);
  }

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🗺️ Floor Map</h1>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {tables.map(n => {
          const active = callsByTable.get(n)?.filter(c => c.status !== "DONE") ?? [];
          const isLit = active.length > 0;

          return (
            <div key={n}
              className={`border-2 rounded-lg p-3 text-center transition
                ${isLit ? "border-red-500 bg-red-50 animate-pulse" : "border-gray-200"}`}>
              <p className="font-bold text-lg">Table {n}</p>
              {active.map(c => (
                <div key={c.id} className="mt-1">
                  <p className="text-sm">{TYPE_EMOJI[c.type] ?? ""} {c.type}</p>
                  {c.status === "NEW" && (
                    <button onClick={() => updateCall(c.id, "ON_THE_WAY")}
                      className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded mt-1">
                      On the way
                    </button>
                  )}
                  {c.status === "ON_THE_WAY" && (
                    <button onClick={() => updateCall(c.id, "DONE")}
                      className="text-xs bg-green-600 text-white px-2 py-0.5 rounded mt-1">
                      Done
                    </button>
                  )}
                </div>
              ))}
              {!isLit && <p className="text-xs text-gray-400 mt-1">OK</p>}
            </div>
          );
        })}
      </div>

      {/* Active calls list */}
      {(calls?.length ?? 0) > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold mb-2">Active Calls</h2>
          <ul className="space-y-1 text-sm">
            {calls?.filter(c => c.status !== "DONE").map(c => (
              <li key={c.id} className="flex justify-between border rounded p-2">
                <span>Table {c.table_number} — {TYPE_EMOJI[c.type]} {c.type}</span>
                <span className="font-medium">{c.status === "ON_THE_WAY" ? "🏃 On the way" : "🆕 New"}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
