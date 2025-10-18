export function updateItem<T extends { id: number | string }>(
  items: T[],
  newItem: T,
  aggregate: (items: T[]) => number,
  isDelete?: boolean
): [T[], number] {
  const updated = isDelete
    ? items.filter((item) => item.id !== newItem.id)
    : [...items.filter((item) => item.id !== newItem.id), newItem];
  const agg = aggregate(updated);
  return [
    updated.sort((a, b) => compare(a.id, b.id)),
    Math.round(agg * 100) / 100,
  ];
}

function compare(a: string | number, b: string | number): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
  throw new Error("types must be the same and either string or number");
}
