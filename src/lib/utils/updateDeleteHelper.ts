export function updateItem<T extends { id: number }, U>(
  items: T[],
  newItem: T,
  aggregate: (items: T[]) => U,
  isDelete?: boolean
): [T[], U] {
  const updated = isDelete
    ? items.filter((item) => item.id !== newItem.id)
    : [...items.filter((item) => item.id !== newItem.id), newItem];
  const agg = aggregate(updated);
  return [updated.sort((a, b) => a.id - b.id), agg];
}
