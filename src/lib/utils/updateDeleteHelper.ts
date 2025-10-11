export function updateItem<T extends { id: number }>(
  items: T[],
  newItem: T,
  aggregate: (items: T[]) => number,
  isDelete?: boolean
): [T[], number] {
  const updated = isDelete
    ? items.filter((item) => item.id !== newItem.id)
    : [...items.filter((item) => item.id !== newItem.id), newItem];
  const agg = aggregate(updated);
  return [updated.sort((a, b) => a.id - b.id), Math.round(agg * 100) / 100];
}
