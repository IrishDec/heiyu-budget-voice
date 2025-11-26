export default function MiniWeeklyBars({
  data,
  color = "indigo",
}: {
  data: number[];
  color?: string;
}) {
  const max = Math.max(...data, 1);

  const colorClass =
    color === "emerald"
      ? "bg-emerald-400"
      : color === "pink"
      ? "bg-rose-400"
      : "bg-indigo-500";

  const barHeight = (value: number) => {
    if (value <= 0) return "0%";
    const ratio = value / max;
    const scaled = 20 + ratio * 70; // min 20%, max 90%
    return `${scaled}%`;
  };

  return (
    <div className="flex justify-between items-end h-20 w-full">
      {data.map((value, i) => (
        <div
          key={i}
          className={`w-2 rounded-full ${colorClass}`}
          style={{ height: barHeight(value) }}
        ></div>
      ))}
    </div>
  );
}



