import TaxiMap from "./TaxiMap";

export default function TaxiNavPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
        <header className="border-b border-white/10 px-4 pb-3 pt-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            HeiyuNav
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Taxi Nav</h1>
          <p className="mt-2 text-sm text-white/70">
            Mobile first test page inside HeiyuBudget
          </p>
        </header>

        <section className="flex-1 p-4">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="h-[75vh] md:h-[85vh]">
              <TaxiMap />
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <button className="rounded-2xl bg-green-500 px-4 py-4 text-base font-medium text-black">
              Start test
            </button>

            <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-base font-medium text-white">
              Use College Green sample
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}