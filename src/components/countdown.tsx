"use client";

import { useEffect, useState } from "react";

function getParts(target: number) {
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function Countdown({ target }: { target: string | Date }) {
  const targetMs = new Date(target).getTime();
  const [parts, setParts] = useState(() => getParts(targetMs));

  useEffect(() => {
    const id = setInterval(() => setParts(getParts(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const units: Array<[string, number]> = [
    ["Days", parts.days],
    ["Hours", parts.hours],
    ["Mins", parts.minutes],
    ["Secs", parts.seconds],
  ];

  return (
    <div className="flex gap-3">
      {units.map(([label, value]) => (
        <div
          key={label}
          className="flex w-16 flex-col items-center rounded-xl border border-border/60 bg-card py-3"
        >
          <span className="text-2xl font-bold tabular-nums text-primary">
            {String(value).padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}
