export function generateTicketNumber(drawDate: Date) {
  const y = drawDate.getFullYear();
  const m = String(drawDate.getMonth() + 1).padStart(2, "0");
  const d = String(drawDate.getDate()).padStart(2, "0");
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `GL-${y}${m}${d}-${rand}`;
}

export function generateTicketNumbers() {
  const pool = Array.from({ length: 49 }, (_, i) => i + 1);
  const picked: number[] = [];
  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked.sort((a, b) => a - b);
}
