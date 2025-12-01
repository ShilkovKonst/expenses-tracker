import {
  GlobalDataType,
  MonthRecord,
  TrackerMeta,
  TrackerTags,
  TrackerYears,
} from "@/lib/types/dataTypes";
export function transformToMonthRecord(form: FormData): MonthRecord {
  return {
    id: Number(form.get("id")) ?? -1,
    year: Number(form.get("year")) ?? -1,
    month: Number(form.get("month")) ?? -1,
    day: Number(form.get("day")) ?? -1,
    type: (String(form.get("type")) as "cost" | "income") ?? "cost",
    description: String(form.get("description")) ?? "",
    amount: Number(form.get("amount")) ?? 0,
    tags: form.getAll("tags").map(Number),
  };
}

export function transformToTagTitle(form: FormData): string {
  return String(form.get("title")) ?? "";
}

export function transformToGlobalData(form: FormData): GlobalDataType {
  const metaString = form.get("meta");
  const tagsString = form.get("tags");
  const yearsString = form.get("years");
  return {
    id: String(form.get("id")) ?? "",
    meta: metaString
      ? parseToMeta(metaString.toString())
      : {
          createdAt: new Date().toLocaleString(),
          updatedAt: new Date().toLocaleString(),
        },
    tags: tagsString ? parseToTags(tagsString.toString()) : {},
    years: yearsString ? parseToYears(yearsString.toString()) : {},
    totalAmount: Number(form.get("id")) ?? 0,
  };
}

export function parseToMeta(s: string): TrackerMeta {
  return JSON.parse(s);
}

export function parseToTags(s: string): TrackerTags {
  return JSON.parse(s);
}

export function parseToYears(s: string): TrackerYears {
  return JSON.parse(s);
}
