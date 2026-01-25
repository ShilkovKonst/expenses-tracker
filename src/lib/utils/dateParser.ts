export function buildFileName(dataId: string | undefined): string {
  const prefix = dataId ?? "tracker";
  const ts = formatDatetoMeta(new Date());

  return `${prefix}_${ts}.json`;
}

export function formatDatetoMeta(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const sec = String(d.getSeconds()).padStart(2, "0");

  return `${dd}/${mm}/${yyyy}_${hh}:${min}:${sec}`;
}

export function parseMetaToDate(str?: string): Date {
  if (!str) return new Date();
  const { 0: datePart, 1: timePart } = str.split("_");
  if (!datePart || !timePart) throw new Error("Invalid meta date format");

  const { 0: dd, 1: mm, 2: yyyy } = datePart.split("/").map(Number);
  const { 0: hh, 1: min, 2: sec } = timePart.split(":").map(Number);

  return new Date(yyyy, mm - 1, dd, hh, min, sec);
}
