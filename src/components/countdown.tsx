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
  // Start null so the server-rendered markup (before we know the client's
  // clock) matches the first client render exactly, avoiding a hydration
  // mismatch. The real countdown is computed after mount.
  const [parts, setParts] = useState<ReturnType<typeof getParts> | null>(null);

  useEffect(() => {
    const tick = () => setParts(getParts(targetMs));
    const immediate = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(immediate);
      clearInterval(id);
    };
  }, [targetMs]);

  const displayParts = parts ?? { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const units: Array<[string, number]> = [
    ["Days", displayParts.days],
    ["Hours", displayParts.hours],
    ["Mins", displayParts.minutes],
    ["Secs", displayParts.seconds],
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
