export function compare(a: string | number, b: string | number): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
  console.log(typeof a, typeof b);
  throw new Error("types must be the same and either string or number");
}
