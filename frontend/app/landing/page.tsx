import Link from "next/link";

export const metadata = {
  title: "HeiyuBudget | Voice-first money tracking",
  description:
    "Voice-first income and expense tracking for trades, taxi drivers, startups and self-employed workers.",
};

const audience = [
  {
    title: "Tradespeople",
    text: "Keep job spend, materials and day-to-day costs easier to track.",
    icon: "🛠️",
  },
  {
    title: "Taxi drivers",
    text: "Log daily takings, fuel, washes, tolls and running costs on the move.",
    icon: "🚕",
  },
  {
    title: "Startups",
    text: "Stay lean and clear while the business is still taking shape.",
    icon: "🚀",
  },
  {
    title: "Self-employed workers",
    text: "Simple money tracking that fits independent work.",
    icon: "💼",
  },
];

const liveNow = [
  "Income tracking",
  "Expense tracking",
  "Voice or text entry",
  "History by day, week, month and year",
  "Mobile-first and easy to use",
];

const comingNext = [
  "Invoices and receipts",
  "Stock and materials",
  "Linking costs to jobs",
  "Card payment",
  "Accountant-ready records",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#fbfaff] text-slate-950">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_22%,rgba(99,102,241,0.18),transparent_34%),radial-gradient(circle_at_18%_82%,rgba(14,165,233,0.12),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between gap-4">
            <Link href="/" className="text-2xl font-black tracking-tight">
              Heiyu<span className="text-indigo-600">Budget</span>
            </Link>

            <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 md:flex">
              <a href="#about" className="hover:text-indigo-600">
                About
              </a>
              <a href="#who" className="hover:text-indigo-600">
                Who it&apos;s for
              </a>
              <a href="#live" className="hover:text-indigo-600">
                What&apos;s live
              </a>
              <a href="#next" className="hover:text-indigo-600">
                What&apos;s next
              </a>
            </nav>

            <Link
              href="/"
              className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
            >
              Try the app
            </Link>
          </header>

          <section className="grid items-center gap-10 py-12 md:grid-cols-[minmax(0,1fr)_420px] lg:gap-14 lg:py-16">
            <div>
              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                From late-night admin to a simpler way to{" "}
                <span className="text-indigo-600">track the money.</span>
              </h1>
<p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
  HeiyuBudget came from real work on the move. After years in
  construction, and later mobile work, the same problem kept showing up
  again and again: money gets made during the day, but the admin gets
  left until night. Income gets missed, expenses are forgotten, and
  small costs disappear into the cracks.
</p>

<p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
  The first version starts with the basics that matter most: fast income
  and expense tracking by voice or text, with history by day, week,
  month and year. It is built for people who do not sit behind a desk
  all day and do not want to finish work only to face another hour of
  paperwork.
</p>

<p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
  The bigger direction is simple: start with tracking, then grow into a
  fuller business flow. That means invoices, receipts, stock and
  materials, linking costs to jobs, card payment, and cleaner records
  that make sense across different countries and working patterns.
</p>

<p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
  HeiyuBudget is being shaped for tradespeople, taxi drivers, startups
  and self-employed workers who need something practical, fast and easy
  to use while real work is happening.
</p>
            </div>

            <div className="w-full md:justify-self-end">
              <div className="rounded-[2rem] border border-slate-900/10 bg-slate-950 p-4 shadow-2xl shadow-indigo-900/20">
                <div className="rounded-[1.5rem] bg-[#111827] p-5 text-white">
                  <div className="mb-5 flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-400">
                    <span>Hey Dec 👋</span>
                    <span className="rounded-full border border-white/10 px-3 py-1">
                      ☰
                    </span>
                  </div>

                  <div className="text-center">
                    <h2 className="text-3xl font-black">
                      Heiyu<span className="text-indigo-400">Budget</span>
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                      Fast voice or text budgeting.
                    </p>
                  </div>

                  <div className="mt-7 space-y-3">
                    <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-4 text-center text-lg font-black">
                      🎤 Tap to Speak
                    </div>
                    <div className="rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-4 text-center text-lg font-black">
                      ✏️ Add by Text
                    </div>
                    <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-4 text-center text-lg font-black">
                      ➕ Add / Manage Categories
                    </div>
                  </div>

                  <div className="mt-7 rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-indigo-200">
                        Totals Summary
                      </h3>
                      <span className="text-sm text-indigo-300">
                        View All →
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                      <div />
                      <div className="font-bold text-slate-300">Today</div>
                      <div className="font-bold text-slate-300">Week</div>

                      <div className="font-bold text-emerald-400">Income</div>
                      <div>€0.00</div>
                      <div>€0.00</div>

                      <div className="font-bold text-pink-400">Expense</div>
                      <div>€0.00</div>
                      <div>€0.00</div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <MiniChart
                      label="Income"
                      color="emerald"
                      values={[30, 42, 35, 48, 62]}
                    />
                    <MiniChart
                      label="Expense"
                      color="pink"
                      values={[55, 20, 28, 38, 30]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="about"
            className="rounded-[2rem] border border-indigo-100 bg-white/90 p-6 shadow-xl shadow-indigo-950/5 backdrop-blur sm:p-8"
          >
            <h2 className="text-2xl font-black tracking-tight">
              Why this exists
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <StoryCard
                number="1"
                icon="👷"
                title="Work happens away from the desk"
                text="Receipts, small purchases and daily income are easy to lose track of when life is on the move."
              />

              <StoryCard
                number="2"
                icon="🌙"
                title="Admin builds up at night"
                text="After the job is done, there are still records to sort, numbers to check and details to remember."
              />

              <StoryCard
                number="3"
                icon="✨"
                title="HeiyuBudget keeps the basics simple"
                text="Capture income and expenses quickly, then build into invoices, stock, jobs, payments and more."
              />
            </div>
          </section>

          <section className="grid gap-6 py-6 lg:grid-cols-[1fr_1.1fr]">
            <div
              id="who"
              className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-indigo-950/5 sm:p-7"
            >
              <h2 className="text-2xl font-black tracking-tight">
                Who it&apos;s for
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {audience.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-black">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FeaturePanel
                id="live"
                title="What’s live now"
                intro="The first version keeps it focused on what matters most."
                items={liveNow}
                color="green"
              />

              <FeaturePanel
                id="next"
                title="What comes next"
                intro="The next stage is the full flow from daily tracking to business admin."
                items={comingNext}
                color="purple"
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-indigo-100 bg-indigo-50/80 p-6 shadow-xl shadow-indigo-950/5 sm:p-8">
            <div className="grid items-center gap-5 lg:grid-cols-[auto_1fr_auto]">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-600 text-3xl text-white">
                🌍
              </div>

              <div>
                <h2 className="text-2xl font-black tracking-tight">
                  Flexible by country
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">
                  HeiyuBudget is designed to work across countries. Day, week,
                  month and year views can fit local tax-week and working
                  patterns, so your numbers make sense wherever you are.
                </p>
              </div>

              <div className="hidden text-6xl opacity-20 lg:block">🗺️</div>
            </div>
          </section>

          <section className="grid gap-6 py-6 lg:grid-cols-[1fr_1.3fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-indigo-950/5 sm:p-8">
              <div className="flex items-start gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-4xl text-indigo-500">
                  👤
                </div>

                <div>
                  <h2 className="text-2xl font-black tracking-tight">
                    Built from real admin pain
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                    HeiyuBudget was created from lived experience. The goal is
                    simple: less typing, less friction, and a tool that fits the
                    way real people work.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <SmallProof
                icon="👥"
                title="Built for real-world workers"
                text="Designed around the realities of on-the-move work."
              />
              <SmallProof
                icon="🔒"
                title="Private, secure and mobile-first"
                text="Your data is yours, protected and accessible anywhere."
              />
              <SmallProof
                icon="⏱️"
                title="Less friction. More time."
                text="Spend less time on admin and more on what matters."
              />
            </div>
          </section>

          <section className="mb-8 rounded-[2rem] bg-gradient-to-r from-indigo-600 to-cyan-500 p-6 text-white shadow-2xl shadow-indigo-900/20 sm:p-8">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <h2 className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
                  Start with tracking today. Grow into the full business flow.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-white/85">
                  HeiyuBudget begins with income and expenses, then grows into
                  invoicing, stock, payments and smarter admin.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-5 text-slate-950 shadow-xl">
               <img
  src="/heiyubudget-qr.png"
  alt="QR code to try HeiyuBudget"
  className="mx-auto h-32 w-32 rounded-xl border border-slate-200 bg-white p-1"
/>
                <p className="mt-4 text-center text-sm font-black">
                  Scan to try HeiyuBudget
                </p>
                <p className="mt-1 text-center text-sm text-indigo-600">
                  heiyubudget.com
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function MiniChart({
  label,
  color,
  values,
}: {
  label: string;
  color: "emerald" | "pink";
  values: number[];
}) {
  const textColor = color === "emerald" ? "text-emerald-300" : "text-pink-300";
  const barColor = color === "emerald" ? "bg-emerald-400" : "bg-pink-400";

  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <p className={`mb-4 text-center text-sm ${textColor}`}>{label}</p>
      <div className="flex h-16 items-end justify-center gap-2">
        {values.map((h) => (
          <span
            key={h}
            className={`w-3 rounded-full ${barColor}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function StoryCard({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-indigo-100 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-indigo-600 text-sm font-black text-white">
          {number}
        </span>
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="mt-5 text-lg font-black leading-tight">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function FeaturePanel({
  id,
  title,
  intro,
  items,
  color,
}: {
  id: string;
  title: string;
  intro: string;
  items: string[];
  color: "green" | "purple";
}) {
  const badge =
    color === "green"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-indigo-100 text-indigo-700";

  return (
    <div
      id={id}
      className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-indigo-950/5 sm:p-7"
    >
      <h2 className="text-2xl font-black tracking-tight">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{intro}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-full px-4 py-2 text-sm font-bold ${badge}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function SmallProof({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-indigo-950/5">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-4 text-base font-black leading-tight">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}