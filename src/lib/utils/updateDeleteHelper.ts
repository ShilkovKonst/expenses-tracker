import { compare } from "./compareHelper";

export function updateItem<T extends { id: number | string }>(
  items: T[],
  oldId: string | number,
  newItem: T,
  aggregate: (items: T[]) => number,
  isDelete?: boolean
): [T[], number] {
  const updated = isDelete
    ? items.filter((item) => item.id !== oldId)
    : [...items.filter((item) => item.id !== oldId), newItem];
  const agg = aggregate(updated);
  return [
    updated.sort((a, b) => compare(a.id, b.id)),
    Math.round(agg * 100) / 100,
  ];
}
