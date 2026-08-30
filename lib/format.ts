const taka = (n: number) => "৳" + n.toLocaleString("en-US");

export function formatPrice(min: number | null, max: number | null): string {
  if (min == null && max == null) return "Price not reported";
  if (min != null && max != null) {
    return min === max ? taka(min) : `${taka(min)} – ${taka(max)}`;
  }
  return taka((min ?? max) as number);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
