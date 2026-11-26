import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 gap-6">
      <h1 className="text-4xl font-bold">🍽️ Restaurant QR</h1>
      <p className="text-lg text-gray-600 text-center max-w-md">
        Scan. Order. Eat. — One system for guests, kitchen, staff and management.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full max-w-sm">
        <Link href="/table/4"
          className="border rounded-lg p-4 text-center hover:bg-stone-100 transition">
          📱 Guest View<br /><span className="text-sm text-gray-500">Table 4 demo</span>
        </Link>
        <Link href="/kitchen"
          className="border rounded-lg p-4 text-center hover:bg-stone-100 transition">
          👨‍🍳 Kitchen<br /><span className="text-sm text-gray-500">Order board</span>
        </Link>
        <Link href="/floor"
          className="border rounded-lg p-4 text-center hover:bg-stone-100 transition">
          🗺️ Floor Map<br /><span className="text-sm text-gray-500">Waiter calls</span>
        </Link>
        <Link href="/dashboard"
          className="border rounded-lg p-4 text-center hover:bg-stone-100 transition">
          📊 Dashboard<br /><span className="text-sm text-gray-500">Live metrics</span>
        </Link>
      </div>

      {/* QR codes for all 10 tables */}
      <details className="mt-8 w-full max-w-sm">
        <summary className="cursor-pointer text-blue-600">View QR codes for all tables</summary>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
            <div key={n} className="border rounded p-2 text-center">
              <p className="font-medium mb-1">Table {n}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/api/qr/${n}`} alt={`QR Table ${n}`} className="mx-auto w-28 h-28" />
            </div>
          ))}
        </div>
      </details>
    </main>
  );
}
