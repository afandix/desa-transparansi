export function formatRupiah(n) {
  const x = Number(n || 0);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(x);
}
export function fmtPercent(num, den) {
  const n = Number(num || 0),
    d = Number(den || 0);
  const p = d > 0 ? Math.round((n / d) * 100) : 0;
  return `${p}%`;
}
export function yearOptions(selectEl, range = 3) {
  const now = new Date().getFullYear();
  const years = [];
  for (let y = now - range; y <= now + range; y++) years.push(y);
  selectEl.innerHTML = years
    .map(
      (y) => `<option value="${y}" ${y === now ? "selected" : ""}>${y}</option>`
    )
    .join("");
}
