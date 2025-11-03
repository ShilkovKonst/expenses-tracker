import { compare } from "./compareHelper";

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
  console.log(updated);
  return [
    updated.sort((a, b) => compare(a.id, b.id)),
    Math.round(agg * 100) / 100,
  ];
}
