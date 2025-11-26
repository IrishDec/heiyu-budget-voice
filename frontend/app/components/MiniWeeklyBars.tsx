export default function MiniWeeklyBars({ data, color = "indigo" }: { data: number[], color?: string }) {
  const max = Math.max(...data, 1);

  const colorClass =
    color === "emerald" ? "bg-emerald-400/70"
    : color === "pink" ? "bg-pink-400/70"
    : "bg-indigo-500/70";

  return (
   <div className="flex items-end justify-around h-20 w-full">
     {data.map((value, i) => {
        const height = (value / max) * 48;
        return (
          <div
            key={i}
            style={{ height: `${height}px` }}
            className={`w-2 rounded-full ${colorClass}`}
          ></div>
        );
      })}
    </div>
  );
}
